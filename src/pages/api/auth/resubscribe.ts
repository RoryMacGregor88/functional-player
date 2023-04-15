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

async function resubscribe(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else if (req.session.user?.email !== req.body.email) {
    return handleForbidden(res, TOKEN_ERROR_MESSAGE);
  } else {
    try {
      const { email, username } = sanitizeBody(req.body);
      const { db } = await connectToDatabase();

      // TODO: must prevent making second subscription with same email
      // how to do this?

      const result = await db.collection<DbUser>(USERS).findOne({ email });

      if (!result) {
        return res
          .status(400)
          .json({ error: { message: EMAIL_NOT_FOUND_MESSAGE } });
      }

      /** create customer on stripe servers */
      const { id: customerId } = await stripe.customers.create({
        email,
        name: username,
      });

      /** create (inactive) subscription on stripe servers */
      const {
        id: subscriptionId,
        status: subscriptionStatus,
        latest_invoice,
      } = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: process.env.TEST_SUBSCRIPTION_PRICE_ID }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      /** type casting */
      const invoice = latest_invoice as stripeFn.Invoice,
        paymentIntent = invoice.payment_intent as stripeFn.PaymentIntent,
        clientSecret = paymentIntent.client_secret;

      const updatedProperties = {
        customerId,
        subscriptionId,
        subscriptionStatus,
      };

      await db.collection<DbUser>(USERS).updateOne(
        { email },
        {
          $set: {
            ...updatedProperties,
          },
        }
      );

      const resUser: User = {
        ...req.session.user,
        ...updatedProperties,
      };

      req.session.user = resUser;
      await req.session.save();

      return res.status(201).json({ resUser, clientSecret });
    } catch (error) {
      await logServerError('resubscribe', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(resubscribe, sessionOptions);
