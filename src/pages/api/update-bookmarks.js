import { withIronSessionApiRoute } from "iron-session/next";

import {
  sessionOptions,
  connectToDatabase,
  handleForbidden,
  logServerError,
  handleServerError,
} from "lib";

import {
  HTTP_METHOD_ERROR_MESSAGE,
  DEFAULT_TOKEN_FORBIDDEN_MESSAGE,
  USERS,
} from "@/src/utils";

async function updateBookmarks(req, res) {
  if (req.method !== "POST") {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else if (req.session.user?.email !== req.body.email) {
    return handleForbidden(res, DEFAULT_TOKEN_FORBIDDEN_MESSAGE);
  } else {
    try {
      const { email, bookmarks } = req.body;
      const { db } = await connectToDatabase();

      await db
        .collection(USERS)
        .findOneAndUpdate({ email }, { $set: { bookmarks } });

      req.session.user = { ...req.session.user, bookmarks };
      await req.session.save();

      return res.status(200).json({ resBookmarks: bookmarks });
    } catch (error) {
      await logServerError("updateBookmarks", error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(updateBookmarks, sessionOptions);
