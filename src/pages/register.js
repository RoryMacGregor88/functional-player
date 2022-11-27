import React, { useState } from 'react';

import { Elements } from '@stripe/react-stripe-js';

import { useRouter } from 'next/router';

import { Grid } from '@mui/material';

import {
  Stepper,
  RegisterForm,
  SubscribeForm,
  SpacedTitle,
  Well,
  LoadMask,
} from '@/src/components';

import { getStripe, http } from '@/src/utils';

import {
  DEFAULT_ERROR_MESSAGE,
  REGISTRATION_SUCCESS_MESSAGE,
} from '@/src/utils/constants';

/** @param {{user: object|null}} props */
export default function Register({ user }) {
  const { push } = useRouter();

  const [activeStep, setActiveStep] = useState(1);
  const [clientSecret, setClientSecret] = useState(null);
  const [wellData, setWellData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!!user) {
    push('/dashboard');
    return <LoadMask />;
  }

  const onNextClick = () => {
    if (!!wellData) {
      setWellData(null);
    }
    setActiveStep(2);
  };

  const registerSubmit = async (event) => {
    setIsLoading(true);
    try {
      const { username, email, password } = event;

      const { error, clientSecret } = await http('/auth/register', {
        username,
        email: email.toLowerCase(),
        password,
      });

      if (!!error) {
        setWellData({ message: error.message });
      } else if (!!clientSecret) {
        setClientSecret(clientSecret);
        setWellData({
          severity: 'success',
          message: REGISTRATION_SUCCESS_MESSAGE,
        });
      }
    } catch (e) {
      setWellData({ message: DEFAULT_ERROR_MESSAGE });
    }
    setIsLoading(false);
  };

  const subscribeSubmit = async (stripe, elements) => {
    setIsLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.BASE_URL}/registration-success`,
        },
      });

      if (!!error) {
        setWellData({ message: DEFAULT_ERROR_MESSAGE });
      }
    } catch (e) {
      setWellData({ message: DEFAULT_ERROR_MESSAGE });
    }
    setIsLoading(false);
  };

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      sx={{ maxWidth: '50rem' }}
    >
      <SpacedTitle>Register</SpacedTitle>
      {!!wellData ? <Well {...wellData} /> : null}
      <Stepper activeStep={activeStep} />
      {activeStep === 1 ? (
        <RegisterForm
          isLoading={isLoading}
          onSubmit={registerSubmit}
          onNextClick={onNextClick}
          disableSubmitButton={!!wellData?.severity}
          disableNextButton={!clientSecret}
        />
      ) : null}
      {activeStep === 2 && !!clientSecret ? (
        <Elements stripe={getStripe()} options={{ clientSecret }}>
          {/* // TODO: Replace P with details about cost/recurrence */}
          <p style={{ textAlign: 'center' }}>Subscribe</p>
          <SubscribeForm
            subscribeSubmit={subscribeSubmit}
            isLoading={isLoading}
          />
        </Elements>
      ) : null}
    </Grid>
  );
}
