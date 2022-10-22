import stripeFn from "stripe";

import { withIronSessionApiRoute } from "iron-session/next";

import { connectToDatabase } from "lib/mongodb";

import { sessionOptions } from "lib/session";

import { USERS, HTTP_METHOD_ERROR_MESSAGE } from "@/src/utils";

const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

async function unsubscribe(req, res) {
  if (req.method === "POST") {
    if (req.session.user?.email !== req.body.email) {
      return res.status(403).send({ error: DEFAULT_TOKEN_FORBIDDEN_MESSAGE });
    }
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

      const updatedUser = {
        ...req.session.user,
        ...updatedProperties,
      };

      req.session.user = updatedUser;
      await req.session.save();

      return res.status(200).json({ ok: true, user: updatedUser });
    } catch (error) {
      console.log("ERROR in unsubscribe: ", error);
      return res.status(500).send({ error });
    }
  } else {
    return res.status(500).send({ error: HTTP_METHOD_ERROR_MESSAGE });
  }
}

export default withIronSessionApiRoute(unsubscribe, sessionOptions);
