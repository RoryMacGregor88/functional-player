import stripeFn from "stripe";

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";

import { connectToDatabase } from "lib/mongodb";

import { USERS } from "@/src/utils/constants";

const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

async function deleteAccount(req, res) {
  if (req.method === "POST") {
    if (req.session.user?.email !== req.body.email) {
      return res
        .status(500)
        .send({ error: "Not allowed. Authorization token required." });
    }
    try {
      const { email, subscriptionId } = req.body;
      const { db } = await connectToDatabase();

      await stripe.subscriptions.del(subscriptionId);

      await db.collection(USERS).deleteOne({ email });
      req.session.destroy();

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.log("error: ", error);
      return res.status(500).send({ error });
    }
  } else {
    return res
      .status(500)
      .send({ error: "Invalid method, only POST requests permitted." });
  }
}

export default withIronSessionApiRoute(deleteAccount, sessionOptions);
