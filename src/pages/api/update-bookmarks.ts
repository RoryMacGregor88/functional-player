import { NextApiRequest, NextApiResponse } from 'next';

import { withIronSessionApiRoute } from 'iron-session/next';

import {
  sessionOptions,
  connectToDatabase,
  handleForbidden,
  logServerError,
  handleServerError,
} from '@/lib';

import {
  HTTP_METHOD_ERROR_MESSAGE,
  TOKEN_ERROR_MESSAGE,
  USERS,
} from '@/src/utils/constants';

import { User } from '@/src/utils/interfaces';

async function updateBookmarks(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else if (req.session.user?.email !== req.body.email) {
    return handleForbidden(res, TOKEN_ERROR_MESSAGE);
  } else {
    try {
      const { email, bookmarks } = req.body;
      const { db } = await connectToDatabase();

      await db
        .collection(USERS)
        .findOneAndUpdate({ email }, { $set: { bookmarks } });

      const resUser: User = { ...req.session.user, bookmarks };

      req.session.user = resUser;
      req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError('updateBookmarks', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(updateBookmarks, sessionOptions);
