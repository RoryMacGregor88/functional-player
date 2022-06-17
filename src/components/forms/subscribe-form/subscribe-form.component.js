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
    setIsLoading(true);
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.BASE_URL}/registration-success`,
        },
      });

      setIsLoading(false);

      if (!!result.error) {
        setWellData({ message: result.error });
      }
    } catch (error) {
      // TODO: stripe's errors (insufficient funds, card declined etc) need to go here
      setIsLoading(false);
      setWellData({ message: DEFAULT_ERROR_MESSAGE, stack: error });
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
