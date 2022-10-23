import { withIronSessionApiRoute } from "iron-session/next";
import {
  connectToDatabase,
  sessionOptions,
  handleForbidden,
  handleServerError,
  logServerError,
} from "lib";
import {
  USERS,
  DEFAULT_TOKEN_FORBIDDEN_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
} from "@/src/utils";

async function lastWatched(req, res) {
  if (req.method !== "POST") {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else if (req.session.user?.email !== req.body.email) {
    return handleForbidden(res, DEFAULT_TOKEN_FORBIDDEN_MESSAGE);
  } else {
    try {
      const { email, _id } = req.body;
      const { db } = await connectToDatabase();

      await db
        .collection(USERS)
        .findOneAndUpdate({ email }, { $set: { lastWatched: _id } });

      const resUser = { ...req.session.user, lastWatched: _id };

      req.session.user = resUser;
      await req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError("lastWatched", error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(lastWatched, sessionOptions);
