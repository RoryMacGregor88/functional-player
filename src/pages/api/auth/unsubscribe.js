import stripeFn from "stripe";

import { withIronSessionApiRoute } from "iron-session/next";

import { connectToDatabase } from "lib/mongodb";

import { sessionOptions } from "lib/session";

import { HTTP_METHOD_ERROR_MESSAGE } from "@/src/utils";

const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

async function unsubscribe(req, res) {
  if (req.method === "POST") {
    if (req.session.user?.email !== req.body.email) {
      return res.status(403).send({ error: DEFAULT_TOKEN_FORBIDDEN_MESSAGE });
    }
    try {
      const { email, subscriptionId } = req.body;

      const { status } = await stripe.subscriptions.del(subscriptionId);

      const { db } = await connectToDatabase();

      await db
        .collection(USERS)
        .findOneAndUpdate({ email }, { $set: { subscriptionStatus: status } });

      req.session.user = { ...req.session.user, subscriptionStatus: status };
      await req.session.save();

      return res.status(200).send({ ok: true });
    } catch (error) {
      res.status(500).send({ error });
    }
  } else {
    res.status(500).send({ error: HTTP_METHOD_ERROR_MESSAGE });
  }
}

export default withIronSessionApiRoute(unsubscribe, sessionOptions);
