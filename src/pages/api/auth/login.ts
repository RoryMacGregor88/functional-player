import { NextApiRequest, NextApiResponse } from 'next';

import { withIronSessionApiRoute } from 'iron-session/next';

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
} from '@/src/utils/constants';

import { DbUser, User, Id } from '@/src/utils/interfaces';

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
        sessionIds: currentSessionIds,
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
       * create new session id for both array on dbUser
       * and to be stored on http cookie
       */
      const newSessionId = uuid() as Id;
      const sessionIds = [...currentSessionIds, newSessionId];

      await db
        .collection<DbUser>(USERS)
        .updateOne({ email }, { $set: { sessionIds } });

      const resUser: User = {
        ...restOfUser,
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
