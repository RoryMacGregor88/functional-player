import { useState, useEffect } from "react";

import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

import { useForm } from "react-hook-form";

import { Button, FormWrapper } from "@/src/components";

import { getStripe } from "@/src/utils";

/**
 * @param {{
 *  setError: function,
 *  onNextClick: function
 *  clientSecret: string
 *  subscriptionData: string
 * }} props
 */
const SubscribeForm = ({
  setError,
  onNextClick,
  clientSecret,
  subscriptionId,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentIntent, setPaymentIntent] = useState(null);

  const notLoaded = !stripe || !elements;

  // TODO:  Server side props can do this?

  // TODO: do this properly
  /** @param {object} values */
  const onSubmit = async (values) => {
    const stripeElement = elements.getElement(PaymentElement);

    try {
      const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: stripeElement,
          billing_details: {},
        },
      });

      setPaymentIntent(paymentIntent);
    } catch (error) {
      setError({
        title: "Error",
        message: "Something went wrong...",
        stack: error,
      });
    }
  };

  return notLoaded ? null : (
    <>
      <FormWrapper onSubmit={onSubmit}>
        <p style={{ textAlign: "center" }}>Subscribe</p>
        <PaymentElement onChange={(e) => console.log("e: ", e)} />
        <Button type="submit" disabled={true}>
          Submit
        </Button>
      </FormWrapper>
      <Button onClick={onNextClick} disabled={notLoaded || !paymentIntent}>
        Next
      </Button>
    </>
  );
};

/**
 * @param {{
 *  setError: function,
 *  insertedId: string,
 *  subscribeHandler: function,
 *  onNextClick: function,
 * }} props
 */
const WrappedComponent = ({
  setError,
  insertedId,
  subscribeHandler,
  onNextClick,
}) => {
  const stripePromise = getStripe();
  const [subscriptionData, setSubscriptionData] = useState({});

  const { clientSecret, subscriptionId } = subscriptionData;

  useEffect(() => {
    (async () => {
      try {
        const subscriptionData = await subscribeHandler({
          insertedId,
        });

        setSubscriptionData(subscriptionData);
      } catch (error) {
        setError({
          title: "Error",
          message: "Something went wrong...",
          stack: error,
        });
      }
    })();
  }, [insertedId, setError, subscribeHandler]);

  return !!clientSecret ? (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <SubscribeForm
        setError={setError}
        clientSecret={clientSecret}
        subscriptionId={subscriptionId}
        onNextClick={onNextClick}
      />
    </Elements>
  ) : null;
};

export default WrappedComponent;
