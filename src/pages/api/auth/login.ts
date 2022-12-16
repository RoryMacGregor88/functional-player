import { NextApiRequest, NextApiResponse } from 'next';

import { withIronSessionApiRoute } from 'iron-session/next';

import { compare } from 'bcryptjs';

import {
  connectToDatabase,
  sessionOptions,
  syncStripeAndDb,
  handleForbidden,
  handleServerError,
  logServerError,
} from '@/lib';

import {
  USERS,
  HTTP_METHOD_ERROR_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
  INCORRECT_PASSWORD_MESSAGE,
} from '@/src/utils/constants';

async function login(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else {
    try {
      const { email, password: formPassword } = req.body;
      const { db } = await connectToDatabase();

      const result = await db.collection(USERS).findOne({ email });

      if (!result) {
        return res.status(400).json({
          error: {
            message: EMAIL_NOT_FOUND_MESSAGE,
          },
        });
      }

      // TODO: subscriptionStatus id not included on token, check this.

      const {
        password: dbPassword,
        subscriptionStatus: currentSubscriptionStatus,
        subscriptionId,
        ...restOfUser
      } = result;

      const checkPassword = await compare(formPassword, dbPassword);

      if (!checkPassword) {
        return res
          .status(400)
          .json({ error: { message: INCORRECT_PASSWORD_MESSAGE } });
      }

      // fresh sync of stripe subscription status upon every login. If
      // subscription status is null (deleted), or is unchanged, original
      // value will be returned
      const { isError, subscriptionStatus } = await syncStripeAndDb({
        db,
        email,
        currentSubscriptionStatus,
        subscriptionId,
      });

      if (isError) {
        return handleServerError(res);
      }

      const resUser = {
        ...restOfUser,
        subscriptionStatus,
      };

      req.session.user = resUser;
      await req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError('login', error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(login, sessionOptions);
