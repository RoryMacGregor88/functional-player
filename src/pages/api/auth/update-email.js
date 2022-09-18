import { withIronSessionApiRoute } from "iron-session/next";
import { connectToDatabase } from "lib/mongodb";
import { sessionOptions } from "lib/session";
import {
  USERS,
  DEFAULT_TOKEN_FORBIDDEN_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
} from "@/src/utils";

async function updateEmail(req, res) {
  if (req.method === "POST") {
    if (req.session.user?.email !== req.body.email) {
      return res.status(403).send({ error: DEFAULT_TOKEN_FORBIDDEN_MESSAGE });
    }
    try {
      const { email, newEmail } = req.body;

      const { db } = await connectToDatabase();
      await db
        .collection(USERS)
        .findOneAndUpdate({ email }, { $set: { email: newEmail } });

      req.session.user = { ...req.session.user, email: newEmail };
      await req.session.save();

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.log("ERROR in updateEmail: ", error);
      return res.status(500).send({ error });
    }
  } else {
    return res.status(500).send({ error: HTTP_METHOD_ERROR_MESSAGE });
  }
}

export default withIronSessionApiRoute(updateEmail, sessionOptions);
