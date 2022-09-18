import stripeFn from "stripe";

import { connectToDatabase } from "lib/mongodb";
import { USERS } from "@/src/utils";

const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

export const syncStripeAndDb = async (
  email,
  currentSubscriptionStatus,
  subscriptionId
) => {
  let subscriptionStatus = currentSubscriptionStatus;

  // subscriptionsStatus can only be null if subscription
  // is deleted. If so, return null value
  if (!subscriptionStatus) {
    return subscriptionStatus;
  }

  const { status: stripeStatus } = await stripe.subscriptions.retrieve(
    subscriptionId
  );

  subscriptionStatus = stripeStatus;

  // if stripe's status does not match db, update status in db
  if (currentSubscriptionStatus !== subscriptionStatus) {
    const { db } = await connectToDatabase();
    await db
      .collection(USERS)
      .findOneAndUpdate({ email }, { $set: { subscriptionStatus } });
  }

  return subscriptionStatus;
};
