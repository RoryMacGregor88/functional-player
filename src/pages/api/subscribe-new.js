import stripeFn from "stripe";

import { connectToDatabase } from "lib/mongodb";

import { USERS } from "@/src/utils/constants";

const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

export default async function subscribe(req, res) {
  if (req.method === "POST") {
    try {
      // const { email } = req.body;
      const email = "rory@test.com";

      // TODO: how to find uer with ID

      // create customer on stripe servers
      const { id: customerId } = await stripe.customers.create({
        email,
      });

      // create (inactive) subscription on stripe servers
      const { id: subscriptionId, latest_invoice } =
        await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: process.env.TEST_SUBSCRIPTION_PRICE_ID }],
          payment_behavior: "default_incomplete",
          expand: ["latest_invoice.payment_intent"],
        });

      // store subscription id on user object in mongoDB
      const { db } = await connectToDatabase();
      await db
        .collection(USERS)
        .updateOne({ email }, { $set: { subscriptionId } });

      return res.status(200).send({
        subscriptionId,
        clientSecret: latest_invoice.payment_intent.client_secret,
      });
    } catch (error) {
      return res.status(400).send({ error });
    }
  } else {
    return res
      .status(500)
      .send({ error: "Invalid method, only POST requests permitted." });
  }
}
