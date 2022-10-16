import stripeFn from "stripe";

import { hash } from "bcryptjs";

import { connectToDatabase } from "lib/mongodb";

import {
  USERS,
  HTTP_METHOD_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
} from "@/src/utils";

const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

export default async function register(req, res) {
  if (req.method === "POST") {
    try {
      const { email, username, password } = req.body;

      const { db } = await connectToDatabase();

      const checkExistingEmail = await db.collection(USERS).findOne({ email });

      if (!!checkExistingEmail) {
        return res
          .status(400)
          .send({ error: { message: "Email already exists." } });
      }

      const checkExistingUsername = await db
        .collection(USERS)
        .findOne({ username });

      if (!!checkExistingUsername) {
        return res
          .status(400)
          .send({ error: { message: "Username is taken." } });
      }

      // if credentials are valid, create customer on stripe servers
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

      await db.collection(USERS).insertOne({
        email,
        username,
        password: await hash(password, 12),
        subscriptionId,
        customerId,
        subscriptionStatus,
        bookmarks: [],
      });

      return res
        .status(201)
        .json({ clientSecret: latest_invoice.payment_intent.client_secret });
    } catch (error) {
      console.log("ERROR in register: ", error);
      return res
        .status(500)
        .send({ error: { message: DEFAULT_ERROR_MESSAGE } });
    }
  } else {
    return res
      .status(500)
      .send({ error: { message: HTTP_METHOD_ERROR_MESSAGE } });
  }
}
