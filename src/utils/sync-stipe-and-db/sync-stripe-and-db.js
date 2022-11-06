import stripeFn from 'stripe';

import { USERS } from '@/src/utils/constants';

const stripe = stripeFn(process.env.STRIPE_TEST_SECRET_KEY);

/**
 * @param {object} db
 * @param {string} email
 * @param {string|null} currentSubscriptionStatus
 * @param {number} subscriptionId
 * @returns {Promise<{ subscriptionStatus: string|null }|{ error: true }>}
 */
async function syncStripeAndDb(
  db,
  email,
  currentSubscriptionStatus,
  subscriptionId
) {
  try {
    // subscriptionStatus can only be null if subscription
    // is deleted. If so, return null value
    // TODO: is this right? Can status be null and still out of sync?
    if (currentSubscriptionStatus === null) {
      return { subscriptionStatus: currentSubscriptionStatus };
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

      return { subscriptionStatus: stripeStatus };
    } else {
      // if unchanged, return current status
      return { subscriptionStatus: currentSubscriptionStatus };
    }
  } catch (e) {
    // error is handled in parent handler
    return { error: true };
  }
}

export default syncStripeAndDb;
