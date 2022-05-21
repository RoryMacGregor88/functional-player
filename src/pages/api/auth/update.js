import { compare, hash } from "bcryptjs";
import { connectToDatabase } from "lib/mongodb";
import { USERS } from "@/src/utils/constants";

// TODO: this is hacked together, read mongo docs on findOneAndUpdate

//TODO: what is email, username not available?

export default async function register(req, res) {
  if (req.method === "POST") {
    try {
      const { email, currentPassword, newPassword } = req.body;

      const { db } = await connectToDatabase();

      // TODO: why searching by ID not work?
      const { password } = await db.collection(USERS).findOne({ email });

      // password verification
      const checkPassword = await compare(currentPassword, password);

      if (!checkPassword) {
        return res.status(200).send({ error: "Incorrect password." });
      }

      await db
        .collection(USERS)
        .updateOne(
          { email },
          { $set: { password: await hash(newPassword, 12) } }
        );

      //TODO: how to get updated user into state
      return res.status(200).json({ ok: true });
    } catch (error) {
      // TODO: test error states timeouts and stuff too (see MongoDB docs)
      return res.status(500).send({ error });
    }
  } else {
    res.status(500).send({ error: "Invalid method, only POST permitted." });
  }
}
