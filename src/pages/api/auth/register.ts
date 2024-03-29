import { NextApiRequest, NextApiResponse } from 'next';

import stripeFn from 'stripe';

import { hash } from 'bcryptjs';

import { v4 as uuid } from 'uuid';

import {
  connectToDatabase,
  logServerError,
  handleForbidden,
  handleServerError,
  sanitizeBody,
} from '@/lib';

import {
  USERS,
  STRIPE_API_VERSION,
  HTTP_METHOD_ERROR_MESSAGE,
  EMAIL_ALREADY_EXISTS_MESSAGE,
  USERNAME_TAKEN_MESSAGE,
} from '@/src/utils/constants';

import { DbUser } from '@/src/utils/interfaces';

const stripe = new stripeFn(process.env.STRIPE_TEST_SECRET_KEY, {
  apiVersion: STRIPE_API_VERSION,
});

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else {
    try {
      const { email, username, password } = sanitizeBody(req.body);
      const { db } = await connectToDatabase();

      const checkExistingEmail = await db
        .collection<DbUser>(USERS)
        .findOne({ email });

      if (checkExistingEmail) {
        return res
          .status(400)
          .json({ error: { message: EMAIL_ALREADY_EXISTS_MESSAGE } });
      }

      const checkExistingUsername = await db
        .collection<DbUser>(USERS)
        .findOne({ username });

      if (checkExistingUsername) {
        return res
          .status(400)
          .json({ error: { message: USERNAME_TAKEN_MESSAGE } });
      }

      /** if credentials are valid, create customer on stripe servers */
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

      await db.collection<DbUser>(USERS).insertOne({
        _id: uuid(),
        email,
        username,
        password: await hash(password, 12),
        subscriptionId,
        customerId,
        subscriptionStatus,
        lastWatched: '',
        bookmarks: [],
        sessions: [],
        creationDate: new Date().toISOString(),
      });

      return res.status(201).json({ clientSecret });
    } catch (error) {
      await logServerError('register', error);
      return handleServerError(res);
    }
  }
}
