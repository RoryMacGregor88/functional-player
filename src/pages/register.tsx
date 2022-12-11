import React, { useState, ReactElement } from 'react';

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
  User,
  WellData,
  UpdateCtx,
  DefaultToastData,
} from '@/src/utils/interfaces';

import {
  DEFAULT_ERROR_MESSAGE,
  REGISTRATION_SUCCESS_MESSAGE,
} from '@/src/utils/constants';

interface Props {
  user: User;
  updateCtx: UpdateCtx;
}

export default function Register({ user, updateCtx }: Props): ReactElement {
  const { push } = useRouter();

  const [activeStep, setActiveStep] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [wellData, setWellData] = useState<WellData | null>(null);
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

  const handleSuccess = (message: string) => {
    setIsLoading(false);
    setWellData({
      severity: 'success',
      message,
    });
  };

  const handleServerError = (error?: { message: string }) => {
    setIsLoading(false);
    setWellData({ message: error?.message ?? DEFAULT_ERROR_MESSAGE });
  };

  const handleClientError = (defaultToastData: DefaultToastData) => {
    setIsLoading(false);
    updateCtx(defaultToastData);
  };

  interface RegisterParams {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  }

  interface RegisterResProps {
    error: Error | undefined;
    clientSecret: string | undefined;
  }

  const registerSubmit = async (values: RegisterParams) => {
    setIsLoading(true);

    const { username, email, password } = values;

    const { error, clientSecret }: RegisterResProps = await http({
      endpoint: '/auth/register',
      formData: {
        username,
        email: email.toLowerCase(),
        password,
      },
      onError: handleClientError,
    });

    if (!!error) {
      handleServerError(error);
    } else if (!!clientSecret) {
      setClientSecret(clientSecret);
      handleSuccess(REGISTRATION_SUCCESS_MESSAGE);
    }
  };

  interface SubscribeResProps {
    error: Error;
  }

  // TODO: string types?
  const subscribeSubmit = async (stripe, elements) => {
    setIsLoading(true);

    const { error }: SubscribeResProps = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.BASE_URL}/registration-success/?redirect=true&`,
      },
    });

    if (!!error) {
      handleServerError();
    }
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
