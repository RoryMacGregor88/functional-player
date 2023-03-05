import { NextApiRequest, NextApiResponse } from 'next';

import { withIronSessionApiRoute } from 'iron-session/next';

import {
  connectToDatabase,
  sessionOptions,
  handleForbidden,
  handleServerError,
  logServerError,
} from '@/lib';

import {
  USERS,
  TOKEN_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
} from '@/src/utils/constants';

import { User } from '@/src/utils/interfaces';

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
      const { email, _id } = req.body;
      const { db } = await connectToDatabase();

      await db
        .collection(USERS)
        .findOneAndUpdate({ email }, { $set: { lastWatched: _id } });

      const resUser: User = { ...req.session.user, lastWatched: _id };

      req.session.user = resUser;
      req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError('lastWatched', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(lastWatched, sessionOptions);
