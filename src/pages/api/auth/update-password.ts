import { NextApiRequest, NextApiResponse } from 'next';

import { hash, compare } from 'bcryptjs';

import { withIronSessionApiRoute } from 'iron-session/next';

import {
  connectToDatabase,
  sessionOptions,
  handleServerError,
  handleForbidden,
  logServerError,
  sanitizeBody,
} from '@/lib';

import {
  USERS,
  SESSION_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  INCORRECT_PASSWORD_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
} from '@/src/utils/constants';

import { DbUser } from '@/src/utils/interfaces';

async function updatePassword(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else if (req.session.user?.email !== req.body.email) {
    return handleForbidden(res, SESSION_ERROR_MESSAGE);
  } else {
    try {
      const { email, currentPassword, newPassword } = sanitizeBody(req.body);
      const { db } = await connectToDatabase();

      const result = await db.collection<DbUser>(USERS).findOne({ email });

      if (!result) {
        return res
          .status(400)
          .json({ error: { message: EMAIL_NOT_FOUND_MESSAGE } });
      }

      const { password: dbPassword } = result;

      const checkPassword = await compare(currentPassword, dbPassword);

      if (!checkPassword) {
        return res
          .status(400)
          .json({ error: { message: INCORRECT_PASSWORD_MESSAGE } });
      }

      await db
        .collection<DbUser>(USERS)
        .updateOne(
          { email },
          { $set: { password: await hash(newPassword, 12) } }
        );

      return res.status(200).json({ ok: true });
    } catch (error) {
      await logServerError('updatePassword', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(updatePassword, sessionOptions);
