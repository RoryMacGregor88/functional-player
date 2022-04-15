import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY);

export default async function subscribe(req, res) {
  const { payment_method, email } = req.body;

  if (req.method === 'POST') {
    try {
      const customer = await stripe.customers.create({
        payment_method,
        email,
        invoice_settings: {
          default_payment_method: payment_method,
        },
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer?.id,
        items: [{ plan: 'price_1JLDJpCvn9sBLAOlmxNBwgKk' }],
        expand: ['latest_invoice.payment_intent'],
      });

      const subscriptionId = subscription.id;
      const { client_secret, status } =
        subscription?.latest_invoice.payment_intent;

      res.json({ subscriptionId, client_secret, status });
    } catch (error) {
      return res.status(400).send({ error: { message: error.message } });
    }
  } else {
    res.status(500).json({ message: 'Route not valid' });
  }
}
