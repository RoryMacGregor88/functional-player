import { NextApiRequest, NextApiResponse } from 'next';

import { withIronSessionApiRoute } from 'iron-session/next';

import {
  connectToDatabase,
  sessionOptions,
  logServerError,
  handleForbidden,
  handleServerError,
  sanitizeBody,
} from '@/lib';

import {
  HTTP_METHOD_ERROR_MESSAGE,
  TOKEN_ERROR_MESSAGE,
  USERS,
} from '@/src/utils/constants';

import { DbUser } from '@/src/utils/interfaces';

async function logout(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else if (req.session.user?.email !== req.body.email) {
    return handleForbidden(res, TOKEN_ERROR_MESSAGE);
  } else {
    try {
      const { db } = await connectToDatabase();
      const { email } = sanitizeBody(req.body);

      /** destroy session ids on all devices */
      await db
        .collection<DbUser>(USERS)
        .updateOne({ email }, { $set: { sessionIds: [] } });

      /** destroy session locally */
      await req.session.destroy();

      return res.status(200).json({ resUser: null });
    } catch (error) {
      await logServerError('logout', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(logout, sessionOptions);
