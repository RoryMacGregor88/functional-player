import { hash, compare } from "bcryptjs";

import { withIronSessionApiRoute } from "iron-session/next";

import { connectToDatabase, sessionOptions } from "lib";

import {
  USERS,
  DEFAULT_TOKEN_FORBIDDEN_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
} from "@/src/utils";

async function updatePassword(req, res) {
  if (req.method === "POST") {
    if (req.session.user?.email !== req.body.email) {
      return res
        .status(403)
        .send({ error: { message: DEFAULT_TOKEN_FORBIDDEN_MESSAGE } });
    }
    try {
      const { email, currentPassword, newPassword } = req.body;

      const { db } = await connectToDatabase();

      const { password: dbPassword } = await db
        .collection(USERS)
        .findOne({ email });

      const checkPassword = await compare(currentPassword, dbPassword);

      if (!checkPassword) {
        return res.status(400).send({ error: "Incorrect password." });
      }

      await db
        .collection(USERS)
        .findOneAndUpdate(
          { email },
          { $set: { password: await hash(newPassword, 12) } }
        );

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.log("ERROR in updatePassword: ", error);
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

export default withIronSessionApiRoute(updatePassword, sessionOptions);
