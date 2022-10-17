import stripeFn from "stripe";

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";

import { connectToDatabase } from "lib/mongodb";

import {
  USERS,
  DEFAULT_TOKEN_FORBIDDEN_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
} from "@/src/utils";

const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

async function deleteAccount(req, res) {
  if (req.method === "POST") {
    if (req.session.user?.email !== req.body.email) {
      return res
        .status(403)
        .send({ error: { message: DEFAULT_TOKEN_FORBIDDEN_MESSAGE } });
    }
    try {
      const { email, customerId } = req.body;
      const { db } = await connectToDatabase();

      await stripe.customers.del(customerId);

      await db.collection(USERS).deleteOne({ email });
      req.session.destroy();

      return res.status(200).json({ resUser: {} });
    } catch (error) {
      console.log("ERROR in deleteAccount: ", error);
      return res
        .status(500)
        .send({ error: { message: DEFAULT_ERROR_MESSAGE } });
    }
  } else {
    return res
      .status(403)
      .send({ error: { message: HTTP_METHOD_ERROR_MESSAGE } });
  }
}

export default withIronSessionApiRoute(deleteAccount, sessionOptions);
