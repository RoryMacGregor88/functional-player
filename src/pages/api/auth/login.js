import { compare } from "bcryptjs";
import { connectToDatabase } from "lib/mongodb";
import { USERS } from "src/utils/constants";

export default async function login(req, res) {
  try {
    const { email: requestEmail, password: requestPassword } = req.body;

    const { db } = await connectToDatabase();

    // email auth
    // MUST LOWERCASE ALL EMAILS OR WILL NOT WORK!!!
    const result = await db.collection(USERS).findOne({
      email: requestEmail,
    });

    if (!result) {
      return res.status(200).json({
        error: {
          message: "No user account associated with this email address.",
        },
      });
    }

    const { _id, email, username, password, subscriptionId } = result;

    // password verification
    const checkPassword = await compare(requestPassword, password);

    if (!checkPassword) {
      return res
        .status(200)
        .json({ error: { message: "Passwords do not match." } });
    }

    // subscription status
    const checkSubscriptionIsActive = async () => {
      console.log("Check Stripe with this ID: ", subscriptionId);
      return true;
    };

    // they won't have an account without a subscription
    // but you need to check if it has run out/been cancelled, etc

    const subscriptionIsActive = await checkSubscriptionIsActive();

    // What about server errors? 500 etc

    return res
      .status(200)
      .json({ user: { _id, email, username, subscriptionIsActive } });
  } catch (error) {
    return res.status(500).send({ error });
  }
}
