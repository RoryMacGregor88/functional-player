import { compare } from "bcryptjs";
import { withIronSessionApiRoute } from "iron-session/next";

import { connectToDatabase } from "lib/mongodb";
import { sessionOptions } from "lib/session";
import { syncStripeAndDb } from "lib/syncStripeAndDb";

import {
  USERS,
  HTTP_METHOD_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
} from "@/src/utils";

async function login(req, res) {
  if (req.method === "POST") {
    try {
      const { db } = await connectToDatabase();

      const { email, password: formPassword } = req.body;

      const result = await db.collection(USERS).findOne({ email });

      if (!result) {
        return res.status(400).send({
          error: {
            message: "No user account associated with that email address.",
          },
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
        return res
          .status(400)
          .send({ error: { message: "Incorrect password." } });
      }

      // fresh sync of stripe subscription status upon every login. If
      // subscription status is null (deleted), or is unchanged, original
      // value will be returned
      const syncedStatus = await syncStripeAndDb(
        email,
        currentSubscriptionStatus,
        subscriptionId
      );

      const resUser = {
        ...restOfUser,
        subscriptionStatus: syncedStatus,
      };
      req.session.user = resUser;
      await req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      console.log("ERROR in login: ", error);
      return res
        .status(500)
        .send({ error: { message: DEFAULT_ERROR_MESSAGE } });
    }
  } else {
    return res
      .status(403)
      .send({ error: { message: HTTP_METHOD_ERROR_MESSAGE } });
  }
}

export default withIronSessionApiRoute(login, sessionOptions);
