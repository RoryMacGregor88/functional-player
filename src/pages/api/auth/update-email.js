import { withIronSessionApiRoute } from "iron-session/next";
import {
  connectToDatabase,
  sessionOptions,
  handleServerError,
  handleForbidden,
  logServerError,
} from "lib";
import {
  USERS,
  DEFAULT_TOKEN_FORBIDDEN_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
} from "@/src/utils";

async function updateEmail(req, res) {
  if (req.method !== "POST") {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else if (req.session.user?.email !== req.body.email) {
    return handleForbidden(res, DEFAULT_TOKEN_FORBIDDEN_MESSAGE);
  } else {
    try {
      const { email, newEmail } = req.body;
      const { db } = await connectToDatabase();

      await db
        .collection(USERS)
        .findOneAndUpdate({ email }, { $set: { email: newEmail } });

      const resUser = { ...req.session.user, email: newEmail };

      req.session.user = resUser;
      await req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError("updateEmail", error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(updateEmail, sessionOptions);
