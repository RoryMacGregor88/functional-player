import { hash } from "bcryptjs";
import { connectToDatabase } from "lib/mongodb";
import { USERS } from "src/utils/constants";

export default async function register(req, res) {
  if (req.method === "POST") {
    try {
      const { email, username, password } = req.body;

      const { db } = await connectToDatabase();

      const checkExistingEmail = await db.collection(USERS).findOne({ email });

      if (checkExistingEmail) {
        res.status(422).json({ error: { message: "Email already exists" } });
        return;
      }

      const checkExistingUsername = await db
        .collection(USERS)
        .findOne({ username });

      if (checkExistingUsername) {
        res.status(422).json({ error: { message: "Username is taken" } });
        return;
      }

      const status = await db.collection(USERS).insertOne({
        email,
        username,
        password: await hash(password, 12),
      });

      console.log("STATUS: ", status);

      res.status(201).json({ message: "USER CREATED: ", ...status });
    } catch (error) {
      return res.status(400).send({ error: { message: error.message } });
    }
  } else {
    res.status(500).json({ error: { message: "Route not valid" } });
  }
}
