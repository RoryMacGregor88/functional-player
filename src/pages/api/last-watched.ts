import { NextApiRequest, NextApiResponse } from 'next';

import { withIronSessionApiRoute } from 'iron-session/next';

import {
  connectToDatabase,
  sessionOptions,
  handleForbidden,
  handleServerError,
  logServerError,
  sanitizeBody,
} from '@/lib';

import {
  USERS,
  TOKEN_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
} from '@/src/utils/constants';

import { User, DbUser } from '@/src/utils/interfaces';

async function lastWatched(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else if (req.session.user?.email !== req.body.email) {
    return handleForbidden(res, TOKEN_ERROR_MESSAGE);
  } else {
    try {
      const { email, _id } = sanitizeBody(req.body);
      const { db } = await connectToDatabase();

      const { value } = await db
        .collection<DbUser>(USERS)
        .findOneAndUpdate({ email }, { $set: { lastWatched: _id } });

      if (!value) {
        return res
          .status(400)
          .json({ error: { message: EMAIL_NOT_FOUND_MESSAGE } });
      }

      const resUser: User = { ...req.session.user, lastWatched: _id };

      req.session.user = resUser;
      await req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError('lastWatched', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(lastWatched, sessionOptions);
