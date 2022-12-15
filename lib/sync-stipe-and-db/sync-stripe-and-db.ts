import stripeFn from 'stripe';

import { USERS } from '@/src/utils/constants';

import { Id } from '@/src/utils/interfaces';

// TODO: what's up with this?
const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

interface Params {
  db: unknown;
  email: string;
  currentSubscriptionStatus: string | null;
  subscriptionId: Id;
}

async function syncStripeAndDb({
  db,
  email,
  currentSubscriptionStatus,
  subscriptionId,
}: Params): Promise<{
  subscriptionStatus: Id | null;
  isError: boolean | null;
}> {
  try {
    // subscriptionStatus can only be null if subscription
    // is deleted. If so, return null value
    // TODO: is this right? Can status be null and still out of sync?
    if (currentSubscriptionStatus === null) {
      return { isError: null, subscriptionStatus: currentSubscriptionStatus };
    }

    const { status: stripeStatus } = await stripe.subscriptions.retrieve(
      subscriptionId
    );

    // if stripe's status does not match db, update status in db
    if (currentSubscriptionStatus !== stripeStatus) {
      await db
        .collection(USERS)
        .findOneAndUpdate(
          { email },
          { $set: { subscriptionStatus: stripeStatus } }
        );

      return { isError: null, subscriptionStatus: stripeStatus };
    } else {
      // if unchanged, return current status
      return { isError: null, subscriptionStatus: currentSubscriptionStatus };
    }
  } catch (e) {
    // error is handled in parent handler
    return { isError: true, subscriptionStatus: null };
  }
}

export default syncStripeAndDb;
