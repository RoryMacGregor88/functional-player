import { FC, ReactElement } from 'react';

import { Typography } from '@mui/material';

import { Elements } from '@stripe/react-stripe-js';

import getStripe from '@/src/utils/get-stripe';

import { STATUS_LABELS } from '@/src/utils/constants';

import { ResubscribeFormValues } from '@/src/utils/interfaces';

import {
  FormWrapper,
  Button,
  Attention,
  SubscribeForm,
} from '@/src/components';

interface UnsubscribeProps {
  handleUnsubscribe: () => void;
  isLoading: boolean;
}

const UnsubscribeForm: FC<UnsubscribeProps> = ({
  handleUnsubscribe,
  isLoading,
}): ReactElement => (
  <FormWrapper onSubmit={handleUnsubscribe}>
    <Button type='submit' isLoading={isLoading}>
      Cancel Subscription
    </Button>
  </FormWrapper>
);

interface Props {
  subscriptionStatus: string;
  handleUnsubscribe: () => void;
  handleStripeCustomer: () => void;
  handleResubscribe: (formvalues: ResubscribeFormValues) => void;
  clientSecret: string;
  isLoading: boolean;
}

// TODO: change hardcoded 'active' into constant

// TODO: 'Are you sure?' before cancelling subscription

// TODO: 'Subscribe' instead of 'Re-enable sub...' when status is incomplete

const UpdateSubscriptionForm: FC<Props> = ({
  subscriptionStatus,
  handleUnsubscribe,
  handleStripeCustomer,
  handleResubscribe,
  clientSecret,
  isLoading,
}): ReactElement => (
  <>
    <Typography variant='h4' sx={{ textAlign: 'center', marginBottom: '1rem' }}>
      Your subscription status:{' '}
      <Attention>
        {!!subscriptionStatus
          ? STATUS_LABELS[subscriptionStatus]
          : 'Subscription not found'}
      </Attention>
    </Typography>
    {!!clientSecret ? (
      <Elements stripe={getStripe()} options={{ clientSecret }}>
        <SubscribeForm
          subscribeSubmit={handleResubscribe}
          isLoading={isLoading}
        />
      </Elements>
    ) : subscriptionStatus === 'active' ? (
      <UnsubscribeForm
        handleUnsubscribe={handleUnsubscribe}
        isLoading={isLoading}
      />
    ) : (
      <FormWrapper onSubmit={handleStripeCustomer}>
        <Button type='submit' isLoading={isLoading}>
          Re-enable Subscription
        </Button>
      </FormWrapper>
    )}
  </>
);

export default UpdateSubscriptionForm;
