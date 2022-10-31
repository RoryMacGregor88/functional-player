import stripeFn from "stripe";

import { withIronSessionApiRoute } from "iron-session/next";

import {
  connectToDatabase,
  sessionOptions,
  handleServerError,
  handleForbidden,
  logServerError,
} from "@/lib";

import {
  USERS,
  HTTP_METHOD_ERROR_MESSAGE,
  TOKEN_ERROR_MESSAGE,
} from "@/src/utils";

const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

async function unsubscribe(req, res) {
  if (req.method !== "POST") {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else if (req.session.user?.email !== req.body.email) {
    return handleForbidden(res, TOKEN_ERROR_MESSAGE);
  } else {
    try {
      const { email, customerId } = req.body;

      await stripe.customers.del(customerId);

      const { db } = await connectToDatabase();

      const updatedProperties = {
        customerId: null,
        subscriptionId: null,
        subscriptionStatus: null,
      };

      await db
        .collection(USERS)
        .findOneAndUpdate({ email }, { $set: { ...updatedProperties } });

      const resUser = {
        ...req.session.user,
        ...updatedProperties,
      };

      req.session.user = resUser;
      await req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError("unsubscribe", error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(unsubscribe, sessionOptions);
