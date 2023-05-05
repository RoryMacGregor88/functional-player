import { NextApiRequest, NextApiResponse } from 'next';

import { withIronSessionApiRoute } from 'iron-session/next';

import { addDays } from 'date-fns';

import { compare } from 'bcryptjs';

import { v4 as uuid } from 'uuid';

import {
  connectToDatabase,
  sessionOptions,
  syncStripeAndDb,
  handleForbidden,
  handleServerError,
  logServerError,
  sanitizeBody,
} from '@/lib';

import {
  USERS,
  HTTP_METHOD_ERROR_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
  INCORRECT_PASSWORD_MESSAGE,
  SESSION_EXPIRY_LENGTH,
} from '@/src/utils/constants';

import { DbUser, User, Id } from '@/src/utils/interfaces';

declare module 'iron-session' {
  interface IronSessionData {
    id?: Id;
    expirationDate?: string;
    user?: User;
  }
}

async function login(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else {
    try {
      const { email, password: formPassword } = sanitizeBody(req.body);
      const { db } = await connectToDatabase();

      const result = await db.collection<DbUser>(USERS).findOne({ email });

      if (!result) {
        return res.status(400).json({
          error: {
            message: EMAIL_NOT_FOUND_MESSAGE,
          },
        });
      }

      const {
        password: dbPassword,
        subscriptionStatus: currentSubscriptionStatus,
        subscriptionId,
        sessions: currentSessions,
        ...restOfUser
      } = result;

      const checkPassword = await compare(formPassword, dbPassword);

      if (!checkPassword) {
        return res
          .status(400)
          .json({ error: { message: INCORRECT_PASSWORD_MESSAGE } });
      }

      /**
       * fresh sync of stripe subscription status upon every login. If
       * subscription status is null (deleted), or is unchanged, original
       * value will be returned
       */
      const { isError, subscriptionStatus } = await syncStripeAndDb({
        db,
        email,
        currentSubscriptionStatus,
        subscriptionId,
      });

      if (isError) {
        return handleServerError(res);
      }

      /**
       * create new session id and expiration date for both array
       * on dbUser and to be stored in http cookie
       */
      const newSessionId = uuid() as Id, // TODO: make this the same as the user id? Any downside to that?
        expirationDate = addDays(
          new Date(),
          SESSION_EXPIRY_LENGTH
        ).toISOString();

      const sessions = [
        ...currentSessions,
        { id: newSessionId, expirationDate },
      ];

      await db
        .collection<DbUser>(USERS)
        .updateOne({ email }, { $set: { sessions } });

      const resUser: User = {
        ...restOfUser,
        // TODO: does frontend ever need subscriptionId?
        subscriptionId,
        subscriptionStatus,
      };

      /**
       * spread is here because session object also has
       * methods such as destroy(), save(), etc
       */
      req.session = {
        ...req.session,
        id: newSessionId,
        user: resUser,
      };

      await req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError('login', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(login, sessionOptions);
