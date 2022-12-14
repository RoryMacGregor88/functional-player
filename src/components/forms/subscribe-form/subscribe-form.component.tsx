import { FC, ReactElement } from 'react';

import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import { Button, FormWrapper, LoadMask } from '@/src/components';

import { SubscribeFormValues } from '@/src/utils/interfaces';

interface Props {
  subscribeSubmit: (formValues: SubscribeFormValues) => void;
  isLoading: boolean;
}

const SubscribeForm: FC<Props> = ({
  subscribeSubmit,
  isLoading,
}): ReactElement => {
  const stripe = useStripe();
  const elements = useElements();

  const stripeIsLoaded = !!stripe && !!elements;

  if (!stripeIsLoaded) return <LoadMask />;

  return (
    <FormWrapper onSubmit={() => subscribeSubmit({ stripe, elements })}>
      <PaymentElement />
      <Button type='submit' isLoading={isLoading}>
        Submit
      </Button>
    </FormWrapper>
  );
};

export default SubscribeForm;
