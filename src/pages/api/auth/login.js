import stripeFn from "stripe";
import { compare } from "bcryptjs";
import { withIronSessionApiRoute } from "iron-session/next";

import { connectToDatabase } from "lib/mongodb";
import { sessionOptions } from "lib/session";

import { USERS } from "@/src/utils/constants";

const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

async function login(req, res) {
  if (req.method === "POST") {
    try {
      const { db } = await connectToDatabase();

      const { email, password: formPassword } = req.body;

      // email auth
      const result = await db
        .collection(USERS)
        .findOne({ email: email.toLowerCase() });

      if (!result) {
        return res.status(200).send({
          error: "No user account associated with this email address.",
        });
      }

      const { password: dbPassword, subscriptionId, ...restOfUser } = result;

      const checkPassword = await compare(formPassword, dbPassword);

      if (!checkPassword) {
        return res.status(200).send({ error: "Incorrect password." });
      }

      const { status: subscriptionStatus } =
        await stripe.subscriptions.retrieve(subscriptionId);

      const user = { ...restOfUser, subscriptionStatus };

      // TODO: must implement `Keep me signed in` checkbox in form
      req.session.user = user;
      await req.session.save();

      return res.status(200).send({ ok: true });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } else {
    return res
      .status(500)
      .send({ error: "Invalid method, only POST requests permitted." });
  }
}

export default withIronSessionApiRoute(login, sessionOptions);
