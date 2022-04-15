import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { compare } from "bcryptjs";

import { connectToDatabase } from "lib/mongodb";

import { USERS } from "src/utils/constants";

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const { db } = await connectToDatabase();

        // email auth
        // MUST LOWERCASE ALL EMAILS OR WILL NOT WORK!!!
        const result = await db.collection(USERS).findOne({
          email: credentials.email,
        });

        if (!result) {
          throw new Error(
            "No user account associated with this email address."
          );
        }

        const { _id, email, username } = result;

        // password verification
        const checkPassword = await compare(
          credentials.password,
          result.password
        );

        if (!checkPassword) {
          throw new Error("Incorrect password.");
        }

        // subscription status
        const checkSubscriptionIsActive = async () => {
          console.log("SUBSCRIPTION ID: ", result.subscriptionId);
          return true;
        };

        // they won't have an account without a subscription
        // but you need to check if it has run out/been cancelled, etc

        const subscriptionIsActive = await checkSubscriptionIsActive();

        // What about server errors? 500 etc

        return { _id, email, username, subscriptionIsActive };
      },
    }),
  ],
});
