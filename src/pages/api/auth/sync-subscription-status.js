import { withIronSessionApiRoute } from 'iron-session/next';

import {
  connectToDatabase,
  sessionOptions,
  logServerError,
  handleForbidden,
  handleServerError,
} from '@/lib';

import { syncStripeAndDb } from '@/src/utils';

import {
  HTTP_METHOD_ERROR_MESSAGE,
  TOKEN_ERROR_MESSAGE,
} from '@/src/utils/constants';

async function syncSubscriptionStatus(req, res) {
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
      } = req.body;

      const { db } = await connectToDatabase();

      const { error, subscriptionStatus } = await syncStripeAndDb(
        db,
        email,
        currentSubscriptionStatus,
        subscriptionId
      );

      if (!!error) {
        return handleServerError(res);
      }

      const resUser = {
        ...req.session.user,
        subscriptionStatus,
      };

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
