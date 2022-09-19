import { compare } from "bcryptjs";
import { withIronSessionApiRoute } from "iron-session/next";

import { connectToDatabase } from "lib/mongodb";
import { sessionOptions } from "lib/session";
import { syncStripeAndDb } from "lib/syncStripeAndDb";

import { USERS, HTTP_METHOD_ERROR_MESSAGE } from "@/src/utils";

async function login(req, res) {
  if (req.method === "POST") {
    try {
      const { db } = await connectToDatabase();

      const { email, password: formPassword } = req.body;

      const result = await db.collection(USERS).findOne({ email });

      // TODO: 'Successful' errors need changed to 'message'
      if (!result) {
        return res.status(200).send({
          error: "No user account associated with that email address.",
        });
      }

      const {
        password: dbPassword,
        subscriptionStatus: currentSubscriptionStatus,
        subscriptionId,
        ...restOfUser
      } = result;

      const checkPassword = await compare(formPassword, dbPassword);

      if (!checkPassword) {
        return res.status(200).send({ error: "Incorrect password." });
      }

      // fresh sync of stripe subscription status upon every login. If
      // subscription status is null (deleted), or is unchanged, original
      // value will be returned
      const syncedStatus = await syncStripeAndDb(
        email,
        currentSubscriptionStatus,
        subscriptionId
      );

      const updatedStatusUser = {
        ...restOfUser,
        subscriptionStatus: syncedStatus,
      };
      req.session.user = updatedStatusUser;
      await req.session.save();

      return res.status(200).send({ ok: true, user: updatedStatusUser });
    } catch (error) {
      console.log("ERROR in login: ", error);
      return res.status(500).send({ error });
    }
  } else {
    return res.status(500).send({ error: HTTP_METHOD_ERROR_MESSAGE });
  }
}

export default withIronSessionApiRoute(login, sessionOptions);
