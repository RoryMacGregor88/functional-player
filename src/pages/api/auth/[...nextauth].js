import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { compare } from "bcryptjs";

import { connectToDatabase } from "lib/mongodb";

import { USERS } from "src/utils/constants";

const options = {
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt(props) {
      props.token.user = props.user;
      return props.token;
    },
    async session({ session }) {
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const { db } = await connectToDatabase();

          // email auth
          // TODO: MUST LOWERCASE ALL EMAILS OR WILL NOT WORK!!!
          const result = await db.collection(USERS).findOne({
            email: credentials.email,
          });

          if (!result) {
            throw new Error(
              "No user account associated with this email address."
            );
          }

          const { _id, email, username, password, subscriptionId } = result;

          // password verification
          const checkPassword = await compare(credentials.password, password);

          if (!checkPassword) {
            throw new Error("Incorrect password.");
          }

          // subscription status
          const checkSubscriptionIsActive = async () => {
            console.log("Check Stripe with this ID: ", subscriptionId);
            // ping Stripe, make sure subscription is active
            return true;
          };

          // they won't have an account without a subscription
          // but you need to check if it has run out/been cancelled, etc

          const subscribed = await checkSubscriptionIsActive();

          // What about server errors? 500 etc

          const user = { _id, email, username, subscribed };
          return user;
        } catch (error) {
          console.log("ERROR: ", error);
          throw new Error("Hit if/else error");
        }
      },
    }),
  ],
};

// TODO: can get hold or res object somehow?
const auth = (req, res) => NextAuth(req, res, options);
export default auth;
