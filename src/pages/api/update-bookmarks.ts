import { NextApiRequest, NextApiResponse } from 'next';

import { withIronSessionApiRoute } from 'iron-session/next';

import {
  sessionOptions,
  connectToDatabase,
  handleForbidden,
  logServerError,
  handleServerError,
  sanitizeBody,
} from '@/lib';

import {
  HTTP_METHOD_ERROR_MESSAGE,
  SESSION_ERROR_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
  USERS,
} from '@/src/utils/constants';

import { User, DbUser } from '@/src/utils/interfaces';

async function updateBookmarks(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else if (req.session.user?.email !== req.body.email) {
    return handleForbidden(res, SESSION_ERROR_MESSAGE);
  } else {
    try {
      const { email, bookmarks } = sanitizeBody(req.body);
      const { db } = await connectToDatabase();

      const { value } = await db
        .collection<DbUser>(USERS)
        .findOneAndUpdate({ email }, { $set: { bookmarks } });

      if (!value) {
        return res
          .status(400)
          .json({ error: { message: EMAIL_NOT_FOUND_MESSAGE } });
      }

      const resUser: User = { ...req.session.user, bookmarks };

      // TODO: this was commented out, why?
      req.session.user = resUser;
      await req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError('updateBookmarks', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(updateBookmarks, sessionOptions);
