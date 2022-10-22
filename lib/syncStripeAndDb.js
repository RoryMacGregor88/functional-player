import stripeFn from "stripe";

import { connectToDatabase } from "lib/mongodb";
import { USERS, DEFAULT_ERROR_MESSAGE } from "@/src/utils";

const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

// TODO: what if error with stripe or mongo? Must throw error to trigger catch block in login.js?

// TODO: also, make sure this still works since changes

export const syncStripeAndDb = async (
  email,
  currentSubscriptionStatus,
  subscriptionId
) => {
  try {
    // subscriptionStatus can only be null if subscription
    // is deleted. If so, return null value
    if (currentSubscriptionStatus === null) {
      return { subscriptionStatus: currentSubscriptionStatus };
    }

    const { status: stripeStatus } = await stripe.subscriptions.retrieve(
      subscriptionId
    );

    // if stripe's status does not match db, update status in db
    if (currentSubscriptionStatus !== stripeStatus) {
      const { db } = await connectToDatabase();
      await db
        .collection(USERS)
        .findOneAndUpdate(
          { email },
          { $set: { subscriptionStatus: stripeStatus } }
        );

      return { subscriptionStatus: stripeStatus };
    } else {
      // if unchanged, return current status
      return { subscriptionStatus: currentSubscriptionStatus };
    }
  } catch (e) {
    return { error: { message: DEFAULT_ERROR_MESSAGE } };
  }
};
