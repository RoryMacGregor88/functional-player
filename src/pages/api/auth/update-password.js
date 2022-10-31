import { hash, compare } from "bcryptjs";

import { withIronSessionApiRoute } from "iron-session/next";

import {
  connectToDatabase,
  sessionOptions,
  handleServerError,
  handleForbidden,
  logServerError,
} from "@/lib";

import {
  USERS,
  TOKEN_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
} from "@/src/utils";

async function updatePassword(req, res) {
  if (req.method !== "POST") {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else if (req.session.user?.email !== req.body.email) {
    return handleForbidden(res, TOKEN_ERROR_MESSAGE);
  } else {
    try {
      const { email, currentPassword, newPassword } = req.body;
      const { db } = await connectToDatabase();

      const { password: dbPassword } = await db
        .collection(USERS)
        .findOne({ email });

      const checkPassword = await compare(currentPassword, dbPassword);

      if (!checkPassword) {
        return res
          .status(400)
          .json({ error: { message: "Incorrect password." } });
      }

      await db
        .collection(USERS)
        .findOneAndUpdate(
          { email },
          { $set: { password: await hash(newPassword, 12) } }
        );

      // TODO: Do this like others? Get rid of OK? Remember reset-password
      return res.status(200).json({ ok: true });
    } catch (error) {
      await logServerError("updatePassword", error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(updatePassword, sessionOptions);
