import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import { Button, FormWrapper } from '@/src/components';

/**
 * @param {{
 *  subscribeSubmit: function
 *  isLoading: boolean
 * }} props
 */
const SubscribeForm = ({ subscribeSubmit, isLoading }) => {
  const stripe = useStripe();
  const elements = useElements();

  const stripeIsLoaded = !!stripe && !!elements;

  return stripeIsLoaded ? (
    <FormWrapper onSubmit={() => subscribeSubmit(stripe, elements)}>
      <PaymentElement />
      <Button type='submit' isLoading={isLoading}>
        Submit
      </Button>
    </FormWrapper>
  ) : null;
};

export default SubscribeForm;
