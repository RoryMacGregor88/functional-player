import nodemailer from "nodemailer";
import { hash } from "bcryptjs";
import { connectToDatabase } from "lib/mongodb";
import { USERS, HTTP_METHOD_ERROR_MESSAGE, CHARS } from "@/src/utils";

const generateTempPassword = () => {
  let str = "";
  for (let i = 0; i < 6; i++) {
    const char = CHARS[Math.floor(Math.random() * CHARS.length)];
    str = str + char;
  }
  return str;
};

export default async function resetPassword(req, res) {
  if (req.method === "POST") {
    try {
      const { email } = req.body;

      const { db } = await connectToDatabase();

      const result = await db.collection(USERS).findOne({ email });

      if (!result) {
        return res.status(200).send({
          message: "No user account associated with that email address.",
        });
      }

      const tempPassword = generateTempPassword();

      await db
        .collection(USERS)
        .findOneAndUpdate(
          { email },
          { $set: { password: await hash(tempPassword, 12) } }
        );

      const html = `<div><p>Hello, ${result.username}.</p><br/><p>Your password has been reset to: <strong>${tempPassword}</strong><p><br/><p>Please use it to log in, then change your password from the <strong>Accounts</strong> tab.</p><br/><p>Kind regards,</p><br/><p>Functional Player</p></div>`;

      // TODO: fix env variables
      const hostEmail = process.env.HOST_EMAIL;

      const transporter = nodemailer.createTransport({
        host: "smtp.outlook.com",
        auth: {
          user: hostEmail,
          pass: process.env.HOST_EMAIL_PASSWORD,
        },
      });

      const data = {
        from: hostEmail,
        to: email,
        subject: "Password Reset",
        html,
      };

      await transporter.sendMail(data);

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.log("ERROR in resetEmail: ", error);
      return res.status(500).send({ error });
    }
  } else {
    return res.status(500).send({ error: HTTP_METHOD_ERROR_MESSAGE });
  }
}
