import stripeFn from "stripe";

import { withIronSessionApiRoute } from "iron-session/next";

import {
  sessionOptions,
  connectToDatabase,
  handleForbidden,
  handleServerError,
  logServerError,
} from "lib";

import {
  USERS,
  TOKEN_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
} from "@/src/utils";

const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

async function deleteAccount(req, res) {
  if (req.method !== "POST") {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else if (req.session.user?.email !== req.body.email) {
    return handleForbidden(res, TOKEN_ERROR_MESSAGE);
  } else {
    try {
      const { email, customerId } = req.body;
      const { db } = await connectToDatabase();

      await stripe.customers.del(customerId);

      await db.collection(USERS).deleteOne({ email });
      req.session.destroy();

      return res.status(200).json({ resUser: null });
    } catch (error) {
      await logServerError("deleteAccount: ", error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(deleteAccount, sessionOptions);
