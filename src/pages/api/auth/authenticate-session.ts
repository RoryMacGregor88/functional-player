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
} from '@/src/utils/constants';

declare module 'iron-session' {
  interface IronSessionData {
    id?: Id;
    expirationDate?: string;
    user?: User;
  }
}

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

      const {
        email,
        subscriptionStatus: currentSubscriptionStatus,
        subscriptionId,
      } = user;

      // TODO: make sure Stripe stuff is tip-top
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

      /** user has no session (logged out or not registered) */
      if (!id) {
        return res.status(200).json({ resUser: null });
      }

      const { sessions } = await db
        .collection<DbUser>(USERS)
        .findOne({ email });

      /**
       * if user has logged out of a different device, or clicked
       * "Log out of all devices", session id array will be empty,
       * even if session exists on another device's browser
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

      // TODO: test this
      const resUser = {
        ...req.session.user,
        subscriptionStatus,
      };

      /**
       * spread is here because session object also has
       * methods such as destroy(), save(), etc
       */
      // TODO: test this
      req.session = {
        ...req.session,
        user: resUser,
      };

      // TODO: test this
      await req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError('authenticateSession', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(authenticateSession, sessionOptions);
