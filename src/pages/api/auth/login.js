import { compare } from "bcryptjs";
import { withIronSessionApiRoute } from "iron-session/next";

import { connectToDatabase } from "lib/mongodb";
import { sessionOptions } from "lib/session";

import { USERS } from "src/utils/constants";

async function login(req, res) {
  if (req.method === "POST") {
    try {
      const { db } = await connectToDatabase();

      const { email, password } = req.body;

      // email auth
      // TODO: MUST LOWERCASE ALL EMAILS OR WILL NOT WORK!!!
      const result = await db.collection(USERS).findOne({ email });

      if (!result) {
        return res.status(200).json({
          error: "No user account associated with this email address.",
        });
      }

      const { password: currentPassword, ...rest } = result;

      // password verification
      const checkPassword = await compare(password, currentPassword);

      if (!checkPassword) {
        return res.status(200).json({ error: "Incorrect password." });
      }

      // subscription status
      const checkSubscriptionIsActive = async () => {
        // ping Stripe, make sure subscription is active
        return true;
      };

      // they won't have an account without a subscription
      // but you need to check if it has run out/been cancelled, etc

      const subscribed = await checkSubscriptionIsActive();

      const user = { ...rest, subscribed };

      // TODO: must implement `Keep me signed in`
      req.session.user = user;
      await req.session.save();

      return res.status(200).json({ user });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({ error });
    }
  } else {
    return res
      .status(500)
      .json({ error: "Invalid method, only POST permitted." });
  }
}

export default withIronSessionApiRoute(login, sessionOptions);
