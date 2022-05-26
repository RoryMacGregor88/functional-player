import { useState, useEffect } from "react";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

import { useForm } from "react-hook-form";

import { Button, FormWrapper } from "@/src/components";

/**
 * @param {{
 *  insertedId: string,
 *  subscribeHandler: function,
 *  setClientSecret: function,
 *  onNextClick: function
 * }} props
 */
const SubscribeForm = ({
  insertedId,
  subscribeHandler,
  setClientSecret,
  onNextClick,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [subscriptionData, setSubscriptionData] = useState({});
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { subscriptionId, clientSecret } = subscriptionData;
  const isLoaded = !!stripe && !!elements && !!clientSecret;

  useEffect(() => {
    (async () => {
      const { error, subscriptionId, clientSecret } = await subscribeHandler({
        insertedId,
      });

      if (!!error) {
        setError(error);
      } else {
        setClientSecret(clientSecret);
        setSubscriptionData({ subscriptionId, clientSecret });
      }
    })();
  }, [insertedId, setClientSecret, subscribeHandler]);

  // TODO: do this properly
  /** @param {object} values */
  const onSubmit = async (values) => {
    console.log("values: ", values);

    const stripeElement = elements.getElement(PaymentElement);

    // Use element to tokenize payment details
    let { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: stripeElement,
          billing_details: {},
        },
      }
    );

    if (!!error) {
      setError(error);
    } else {
      console.log("paymentIntent: ", paymentIntent);
      onNextClick();
    }
  };

  // isLoaded
  return false ? null : (
    <>
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <p style={{ textAlign: "center" }}>Subscribe</p>
        <div
          style={{
            height: "10rem",
            width: "100%",
            border: "2px solid hotpink",
            padding: "2rem",
          }}
        >
          <h3>TOP</h3>
          <PaymentElement options={{ clientSecret }} />
          <h3>BOTTOM</h3>
        </div>
        <Button type="submit" disabled={!!Object.keys(errors).length}>
          Submit
        </Button>
      </FormWrapper>
      <Button onClick={onNextClick} disabled={!isLoaded}>
        Next
      </Button>
    </>
  );
};

export default SubscribeForm;
