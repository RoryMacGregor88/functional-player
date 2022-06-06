import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

import { Button, FormWrapper } from "@/src/components";

import { DEFAULT_ERROR_MESSAGE } from "@/src/utils";

/** @param {{setWellData: function}} props */
const SubscribeForm = ({ setWellData }) => {
  const stripe = useStripe();
  const elements = useElements();

  const isLoaded = !!stripe && !!elements;

  const subscribeSubmit = async (e) => {
    e.preventDefault();
    const return_url = `${process.env.BASE_URL}/registration-success`;
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url,
        },
      });

      if (!!result.error) {
        setWellData({
          title: "Error",
          message: error,
        });
      }
    } catch (error) {
      // TODO: stripe's errors (insufficient funds, card declined etc) need to go here
      setWellData({
        title: "Error",
        message: DEFAULT_ERROR_MESSAGE,
        stack: error,
      });
    }
  };

  return isLoaded ? (
    <FormWrapper onSubmit={subscribeSubmit}>
      <p style={{ textAlign: "center" }}>Subscribe</p>
      <PaymentElement />
      <Button type="submit" disabled={!isLoaded}>
        Submit
      </Button>
    </FormWrapper>
  ) : null;
};

export default SubscribeForm;
