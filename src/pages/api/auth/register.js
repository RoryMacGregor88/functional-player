import { hash } from "bcryptjs";
import { connectToDatabase } from "lib/mongodb";
import { USERS } from "src/utils/constants";

//TODO: next-auth for this, or manual?
export default async function register(req, res) {
  if (req.method === "POST") {
    try {
      const { email, username, password } = req.body;

      const { db } = await connectToDatabase();

      const checkExistingEmail = await db.collection(USERS).findOne({ email });

      if (!!checkExistingEmail) {
        return res
          .status(200)
          .json({ error: { message: "Email already exists." } });
      }

      const checkExistingUsername = await db
        .collection(USERS)
        .findOne({ username });

      if (!!checkExistingUsername) {
        return res
          .status(200)
          .json({ error: { message: "Username is taken." } });
      }

      const { insertedId } = await db.collection(USERS).insertOne({
        email,
        username,
        password: await hash(password, 12),
      });

      res.status(201).json({ insertedId });
    } catch (error) {
      // TODO: test error states (timeouts and stuff too, see MongoDB docs)
      return res.status(500).send({ error });
    }
  } else {
    res.status(500).json({ error: { message: "Route not valid" } });
  }
}
