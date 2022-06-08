import stripeFn from "stripe";
import { hash } from "bcryptjs";
import { connectToDatabase } from "lib/mongodb";
import { USERS } from "@/src/utils/constants";

const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

export default async function register(req, res) {
  if (req.method === "POST") {
    try {
      const { email, username, password } = req.body;

      const { db } = await connectToDatabase();

      const checkExistingEmail = await db.collection(USERS).findOne({ email });

      if (!!checkExistingEmail) {
        return res.status(200).send({ error: "Email already exists." });
      }

      const checkExistingUsername = await db
        .collection(USERS)
        .findOne({ username });

      if (!!checkExistingUsername) {
        return res.status(200).send({ error: "Username is taken." });
      }

      // if creds are valid, create stripe customer, inactive subscription
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

      await db.collection(USERS).insertOne({
        email,
        username,
        password: await hash(password, 12),
        subscriptionId,
      });

      // TODO: add count in here, to measure how many have registered in total

      return res
        .status(201)
        .json({ clientSecret: latest_invoice.payment_intent.client_secret });
    } catch (error) {
      // TODO: test error states (timeouts and stuff too, see MongoDB docs)
      return res.status(500).send({ error });
    }
  } else {
    res
      .status(500)
      .send({ error: "Invalid method, only POST requests permitted." });
  }
}
