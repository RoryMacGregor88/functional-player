import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise = null;

const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_TEST_STRIPE_PUBLISHABLE_KEY
    );
  }
  return stripePromise;
};

export default getStripe;
