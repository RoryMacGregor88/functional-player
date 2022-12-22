import { NextApiRequest, NextApiResponse } from 'next';

import { withIronSessionApiRoute } from 'iron-session/next';

import {
  sessionOptions,
  handleForbidden,
  handleServerError,
  logServerError,
} from '@/lib';

import { User } from '@/src/utils/interfaces';

declare module 'iron-session' {
  interface IronSessionData {
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
      // if no session user found, user is logged out, return null value
      const resUser: User = req.session.user ?? null;
      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError('authenticateToken', error);
      return res
        .status(500)
        .json({ resError: error, test: 'THIS IS THE ERROR' });
      // return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(authenticateToken, sessionOptions);
