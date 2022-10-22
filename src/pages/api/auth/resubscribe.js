import stripeFn from "stripe";

import { withIronSessionApiRoute } from "iron-session/next";

import { connectToDatabase, sessionOptions } from "lib";

import { USERS, HTTP_METHOD_ERROR_MESSAGE } from "@/src/utils";

const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

async function resubscribe(req, res) {
  if (req.method === "POST") {
    if (req.session.user?.email !== req.body.email) {
      return res.status(403).send({ error: DEFAULT_TOKEN_FORBIDDEN_MESSAGE });
    }
    try {
      const { db } = await connectToDatabase();

      const { email, username } = req.body;

      // TODO: prevent making second subscription with same email

      // create customer on stripe servers
      const { id: customerId } = await stripe.customers.create({
        email,
        name: username,
      });

      // create (inactive) subscription on stripe servers
      const {
        id: subscriptionId,
        status: subscriptionStatus,
        latest_invoice,
      } = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: process.env.TEST_SUBSCRIPTION_PRICE_ID }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });

      const updatedProperties = {
        customerId,
        subscriptionId,
        subscriptionStatus,
      };

      await db.collection(USERS).findOneAndUpdate(
        { email },
        {
          $set: {
            ...updatedProperties,
          },
        }
      );

      req.session.user = {
        ...req.session.user,
        ...updatedProperties,
      };
      await req.session.save();

      return res
        .status(201)
        .json({ clientSecret: latest_invoice.payment_intent.client_secret });
    } catch (error) {
      console.log("ERROR in resubscribe: ", error);
      return res.status(500).send({ error: HTTP_METHOD_ERROR_MESSAGE });
    }
  } else {
    return res.status(500).send({ error: HTTP_METHOD_ERROR_MESSAGE });
  }
}

export default withIronSessionApiRoute(resubscribe, sessionOptions);
