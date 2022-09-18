import { withIronSessionApiRoute } from "iron-session/next";

import { sessionOptions } from "lib/session";
import { connectToDatabase } from "lib/mongodb";

import {
  HTTP_METHOD_ERROR_MESSAGE,
  DEFAULT_TOKEN_FORBIDDEN_MESSAGE,
  USERS,
} from "@/src/utils";

async function updateBookmarks(req, res) {
  if (req.method === "POST") {
    if (req.session.user?.email !== req.body.email) {
      return res.status(403).send({ error: DEFAULT_TOKEN_FORBIDDEN_MESSAGE });
    }
    try {
      const { db } = await connectToDatabase();

      const { email, bookmarks } = req.body;

      await db
        .collection(USERS)
        .findOneAndUpdate({ email }, { $set: { bookmarks } });

      req.session.user = { ...req.session.user, bookmarks };
      await req.session.save();

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.log("ERROR in updateBookmarks: ", error);
      return res.status(500).send({ error });
    }
  } else {
    return res.status(500).send({ error: HTTP_METHOD_ERROR_MESSAGE });
  }
}

export default withIronSessionApiRoute(updateBookmarks, sessionOptions);
