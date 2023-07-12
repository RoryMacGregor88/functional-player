import { NextApiRequest, NextApiResponse } from 'next';

import { withIronSessionApiRoute } from 'iron-session/next';

import {
  connectToDatabase,
  sessionOptions,
  handleForbidden,
  handleServerError,
  logServerError,
  verifySessions,
  syncStripeAndDb,
} from '@/lib';

import { User, DbUser, Id } from '@/src/utils/interfaces';

import {
  USERS,
  SESSION_EXPIRED_MESSAGE,
  GET_METHOD_ERROR_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
} from '@/src/utils/constants';

declare module 'iron-session' {
  interface IronSessionData {
    id?: Id;
    expirationDate?: string;
    user?: User;
  }
}

// TODO: SERVER ERROR in authenticateSession:  TypeError: Cannot destructure property 'email' of 'user' as it is undefined.

async function authenticateSession(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'GET') {
    return handleForbidden(res, GET_METHOD_ERROR_MESSAGE);
  } else {
    try {
      const { db } = await connectToDatabase();
      const { id, user } = req.session;

      /** user has no session (logged out or not registered) */
      if (!id) {
        return res.status(200).json({ resUser: null });
      }

      // TODO: change this to look for user by session id?
      const result = await db
        .collection<DbUser>(USERS)
        .findOne({ email: user.email });

      if (!result) {
        return res.status(400).json({
          error: {
            message: EMAIL_NOT_FOUND_MESSAGE,
          },
        });
      }

      const {
        email,
        subscriptionStatus: currentSubscriptionStatus,
        subscriptionId,
        sessions,
      } = result;

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
       * if user has logged out of a different device, or clicked
       * "Log out of all devices", session id array will be empty,
       * even if session exists on current device's browser
       */
      if (!sessions.length) {
        await req.session.destroy();
        return res.status(403).json({
          error: { message: SESSION_EXPIRED_MESSAGE },
          redirect: true,
        });
      }

      /** separate valid and invalid sessions */
      const { validSessions, invalidSessions } = verifySessions(sessions);

      /** destroy invalid sessions in db */
      if (!!invalidSessions.length) {
        await db
          .collection<DbUser>(USERS)
          .updateOne({ email }, { $set: { sessions: validSessions } });
      }

      /** local session is not valid */
      if (!validSessions.find((s) => s.id === id)) {
        /** destroy local session (already destoyed in db) */
        await req.session.destroy();

        return res.status(403).json({
          error: { message: SESSION_EXPIRED_MESSAGE },
          redirect: true,
        });
      }

      const resUser = {
        ...req.session.user,
        subscriptionStatus,
      };

      /**
       * spread is here because session object also has
       * methods such as destroy(), save(), etc
       */
      req.session = {
        ...req.session,
        user: resUser,
      };

      await req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError('authenticateSession', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(authenticateSession, sessionOptions);
