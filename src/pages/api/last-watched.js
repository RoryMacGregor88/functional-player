import { withIronSessionApiRoute } from "iron-session/next";
import { connectToDatabase } from "lib/mongodb";
import { sessionOptions } from "lib/session";
import {
  USERS,
  DEFAULT_TOKEN_FORBIDDEN_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
} from "@/src/utils";

async function lastWatched(req, res) {
  if (req.method === "POST") {
    if (req.session.user?.email !== req.body.email) {
      return res.status(403).send({ error: DEFAULT_TOKEN_FORBIDDEN_MESSAGE });
    }
    try {
      const { email, _id } = req.body;
      const { db } = await connectToDatabase();

      await db
        .collection(USERS)
        .findOneAndUpdate({ email }, { $set: { lastWatched: _id } });

      const resUser = { ...req.session.user, lastWatched: _id };

      req.session.user = resUser;
      await req.session.save();

      return res.status(200).json({ ok: true, resUser });
    } catch (error) {
      console.log("ERROR in lastWatched: ", error);
      return res.status(500).send({ error });
    }
  } else {
    return res.status(500).send({ error: HTTP_METHOD_ERROR_MESSAGE });
  }
}

export default withIronSessionApiRoute(lastWatched, sessionOptions);
