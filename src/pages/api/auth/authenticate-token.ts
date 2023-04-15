import { NextApiRequest, NextApiResponse } from 'next';

import { withIronSessionApiRoute } from 'iron-session/next';

import {
  connectToDatabase,
  sessionOptions,
  handleForbidden,
  handleServerError,
  logServerError,
} from '@/lib';

import { User, DbUser, Id } from '@/src/utils/interfaces';

import { USERS, SESSION_EXPIRED_MESSAGE } from '@/src/utils/constants';

// TODO: is this doing anything? If not, remove from login too
declare module 'iron-session' {
  interface IronSessionData {
    id?: Id;
    user?: User;
  }
}

async function authenticateToken(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'GET') {
    return handleForbidden(res, 'Invalid method, only GET requests permitted.');
  } else {
    try {
      const { db } = await connectToDatabase();
      const { id, user: sessionuser } = req.session;

      /** user has no session (logged out or not registered) */
      if (!id) {
        return res.status(200).json({ resUser: null });
      }

      // TODO: If token has expired, filter from array of tokens on user
      // (to not have orphaned tokens lying around), return error
      // message directing to re-route to login
      // how to do this?

      const email = sessionuser?.email;
      const dbUser = await db.collection<DbUser>(USERS).findOne({ email });

      if (!dbUser.sessionIds.includes(id)) {
        /** destroy all session ids to log out of all devices */
        await db
          .collection<DbUser>(USERS)
          .updateOne({ email }, { $set: { sessionIds: [] } });

        /** destroy token locally */
        await req.session.destroy();

        return res.status(403).json({
          error: { message: SESSION_EXPIRED_MESSAGE },
          redirect: true,
        });
      } else {
        return res.status(200).json({ resUser: req.session.user });
      }
    } catch (error) {
      await logServerError('authenticateToken', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(authenticateToken, sessionOptions);
