import { NextApiRequest, NextApiResponse } from 'next';

import { withIronSessionApiRoute } from 'iron-session/next';

import {
  connectToDatabase,
  sessionOptions,
  handleForbidden,
  handleServerError,
  logServerError,
  verifySessions,
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

async function authenticateToken(
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

      const email = user.email;
      const { sessions } = await db
        .collection<DbUser>(USERS)
        .findOne({ email });

      /**
       * if user has logged out of a different device, or clicked
       * "Log out of all devices", session id array will be empty,
       * even if session exists on another device
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

      return res.status(200).json({ resUser: req.session.user });
    } catch (error) {
      await logServerError('authenticateToken', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(authenticateToken, sessionOptions);
