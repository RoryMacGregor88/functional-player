import stripeFn from 'stripe';

import { Db } from 'mongodb';

import { USERS, STRIPE_API_VERSION } from '@/src/utils/constants';

import { Id, DbUser } from '@/src/utils/interfaces';

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
  isError: boolean;
}> {
  try {
    // subscriptionStatus can only be null if subscription
    // has been deleted. If so, return null value
    // TODO: is this right? Can status be null and still out of sync?
    if (currentSubscriptionStatus === null) {
      return { isError: false, subscriptionStatus: currentSubscriptionStatus };
    }

    const { status: stripeStatus } = await stripe.subscriptions.retrieve(
      String(subscriptionId)
    );

    console.log('STRIPE TYPE: ', typeof stripeStatus);

    // if stripe's status does not match db, update status in db
    if (currentSubscriptionStatus !== stripeStatus) {
      console.log('STRIPE IS NOT EQUAL');

      // does this need a check? Can this be broken through use input?
      await db
        .collection<DbUser>(USERS)
        .findOneAndUpdate(
          { email },
          { $set: { subscriptionStatus: stripeStatus } }
        );

      return { isError: false, subscriptionStatus: stripeStatus };
    } else if (currentSubscriptionStatus === stripeStatus) {
      console.log('STRIPE IS EQUAL');
      // if unchanged, return current status
      return { isError: false, subscriptionStatus: currentSubscriptionStatus };
    }
  } catch (e) {
    // error is handled in parent handler
    return { isError: true, subscriptionStatus: null };
  }
}

export default syncStripeAndDb;
