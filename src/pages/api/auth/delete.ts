import { NextApiRequest, NextApiResponse } from 'next';

import { compare } from 'bcryptjs';

import stripeFn from 'stripe';

import { withIronSessionApiRoute } from 'iron-session/next';

import {
  sessionOptions,
  connectToDatabase,
  handleForbidden,
  handleServerError,
  logServerError,
  sanitizeBody,
} from '@/lib';

import {
  USERS,
  STRIPE_API_VERSION,
  TOKEN_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
  INCORRECT_PASSWORD_MESSAGE,
} from '@/src/utils/constants';

import { DbUser } from '@/src/utils/interfaces';

const stripe = new stripeFn(process.env.STRIPE_TEST_SECRET_KEY, {
  apiVersion: STRIPE_API_VERSION,
});

async function deleteAccount(
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
        customerId,
        password: formPassword,
      } = sanitizeBody(req.body);

      const { db } = await connectToDatabase();
      const result = await db.collection<DbUser>(USERS).findOne({ email });

      if (!result) {
        return res.status(400).json({
          error: {
            message: EMAIL_NOT_FOUND_MESSAGE,
          },
        });
      }

      const { password: dbPassword } = result;
      const checkPassword = await compare(formPassword, dbPassword);

      if (!checkPassword) {
        return res
          .status(400)
          .json({ error: { message: INCORRECT_PASSWORD_MESSAGE } });
      }

      await stripe.customers.del(customerId);

      await db.collection<DbUser>(USERS).deleteOne({ email });
      await req.session.destroy();

      return res.status(200).json({ resUser: null });
    } catch (error) {
      await logServerError('deleteAccount: ', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(deleteAccount, sessionOptions);
