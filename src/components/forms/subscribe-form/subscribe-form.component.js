import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

import { getStripe } from "@/src/utils";

import { Button, FormWrapper } from "@/src/components";

/**
 * @param {{
 *  subscriptionSubmit: function
 * }} props
 */
const SubscribeForm = ({ subscriptionSubmit }) => {
  const stripe = useStripe();
  const elements = useElements();

  const isLoaded = !!stripe && !!elements;

  return isLoaded ? (
    <FormWrapper onSubmit={subscriptionSubmit}>
      <p style={{ textAlign: "center" }}>Subscribe</p>
      <PaymentElement />
      <Button type="submit" disabled={!isLoaded}>
        Submit
      </Button>
    </FormWrapper>
  ) : null;
};

/**
 * @param {{
 *  clientSecret: string,
 *  subscriptionSubmit: function,
 * }} props
 */
const WrappedComponent = ({ clientSecret, subscriptionSubmit }) =>
  !!clientSecret ? (
    <Elements stripe={getStripe()} options={{ clientSecret }}>
      <SubscribeForm subscriptionSubmit={subscriptionSubmit} />
    </Elements>
  ) : null;

export default WrappedComponent;
