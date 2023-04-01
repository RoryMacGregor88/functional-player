import { NextApiRequest, NextApiResponse } from 'next';

import { withIronSessionApiRoute } from 'iron-session/next';

import {
  connectToDatabase,
  sessionOptions,
  syncStripeAndDb,
  logServerError,
  handleForbidden,
  handleServerError,
  sanitizeBody,
} from '@/lib';

import {
  HTTP_METHOD_ERROR_MESSAGE,
  TOKEN_ERROR_MESSAGE,
} from '@/src/utils/constants';

import { User } from '@/src/utils/interfaces';

async function syncSubscriptionStatus(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else if (req.session.user?.email !== req.body.email) {
    return handleForbidden(res, TOKEN_ERROR_MESSAGE);
  } else {
    try {
      const {
        email,
        subscriptionStatus: currentSubscriptionStatus,
        subscriptionId,
      } = sanitizeBody(req.body);

      const { db } = await connectToDatabase();

      const { isError, subscriptionStatus } = await syncStripeAndDb({
        db,
        email,
        currentSubscriptionStatus,
        subscriptionId,
      });

      if (isError) {
        return handleServerError(res);
      }

      const resUser: User = {
        ...req.session.user,
        subscriptionStatus,
      };

      // TODO: why this erroring? await added, does this fix it? It fixed login
      req.session.user = resUser;
      await req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError('syncSubscriptionStatus', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(syncSubscriptionStatus, sessionOptions);
