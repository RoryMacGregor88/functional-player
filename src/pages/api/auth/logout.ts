import { NextApiRequest, NextApiResponse } from 'next';

import { withIronSessionApiRoute } from 'iron-session/next';

import {
  sessionOptions,
  logServerError,
  handleForbidden,
  handleServerError,
} from '@/lib';

import {
  HTTP_METHOD_ERROR_MESSAGE,
  TOKEN_ERROR_MESSAGE,
} from '@/src/utils/constants';

async function logout(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
    // body not used in DB operations, no sanitization required
  } else if (req.session.user?.email !== req.body.email) {
    return handleForbidden(res, TOKEN_ERROR_MESSAGE);
  } else {
    try {
      await req.session.destroy();
      return res.status(200).json({ resUser: null });
    } catch (error) {
      await logServerError('logout', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(logout, sessionOptions);
