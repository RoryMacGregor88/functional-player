import stripeFn from 'stripe';

import { Db } from 'mongodb';

import { USERS, STRIPE_API_VERSION } from '@/src/utils/constants';

import { Id } from '@/src/utils/interfaces';

const stripe = new stripeFn(process.env.STRIPE_TEST_SECRET_KEY, {
  apiVersion: STRIPE_API_VERSION,
});

interface Params {
  db: Db;
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
  subscriptionStatus: string | null;
  isError: boolean | null;
}> {
  try {
    // subscriptionStatus can only be null if subscription
    // has been deleted. If so, return null value
    // TODO: is this right? Can status be null and still out of sync?
    if (currentSubscriptionStatus === null) {
      return { isError: null, subscriptionStatus: currentSubscriptionStatus };
    }

    // TODO: fix this, get rid of ID interface
    const id = `${subscriptionId}`;

    const { status: stripeStatus } = await stripe.subscriptions.retrieve(id);

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
