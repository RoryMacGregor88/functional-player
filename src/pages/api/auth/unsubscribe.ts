import { NextApiRequest, NextApiResponse } from 'next';

import stripeFn from 'stripe';

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
  STRIPE_API_VERSION,
  HTTP_METHOD_ERROR_MESSAGE,
  TOKEN_ERROR_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
} from '@/src/utils/constants';

import { User, DbUser } from '@/src/utils/interfaces';

const stripe = new stripeFn(process.env.STRIPE_TEST_SECRET_KEY, {
  apiVersion: STRIPE_API_VERSION,
});

async function unsubscribe(
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
      const { email, customerId } = sanitizeBody(req.body);

      const result = await db.collection<DbUser>(USERS).findOne({ email });

      if (!result) {
        return res
          .status(400)
          .json({ error: { message: EMAIL_NOT_FOUND_MESSAGE } });
      }

      await stripe.customers.del(customerId);

      const updatedProperties = {
        customerId: null,
        subscriptionId: null,
        subscriptionStatus: null,
      };

      await db
        .collection<DbUser>(USERS)
        .updateOne({ email }, { $set: { ...updatedProperties } });

      const resUser: User = {
        ...req.session.user,
        ...updatedProperties,
      };

      req.session.user = resUser;
      await req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError('unsubscribe', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(unsubscribe, sessionOptions);
