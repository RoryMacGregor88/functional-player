import { compare } from 'bcryptjs';

import { withIronSessionApiRoute } from 'iron-session/next';

import {
  connectToDatabase,
  sessionOptions,
  handleForbidden,
  handleServerError,
  logServerError,
} from '@/lib';

import { syncStripeAndDb } from '@/src/utils';

import {
  USERS,
  HTTP_METHOD_ERROR_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
} from '@/src/utils/constants';

async function login(req, res) {
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
          .json({ error: { message: 'Incorrect password.' } });
      }

      // fresh sync of stripe subscription status upon every login. If
      // subscription status is null (deleted), or is unchanged, original
      // value will be returned
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
