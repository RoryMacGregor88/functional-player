import { Elements } from "@stripe/react-stripe-js";

import { useRouter } from "next/router";
import React, { useState } from "react";
import { Grid } from "@mui/material";

import {
  Stepper,
  RegisterForm,
  SubscribeForm,
  SpacedTitle,
  Well,
  LoadMask,
} from "@/src/components";

import {
  getStripe,
  http,
  DEFAULT_ERROR_MESSAGE,
  REGISTRATION_SUCCESS_MESSAGE,
} from "@/src/utils";

/** @param {{user: object|null}} props */
export default function Register({ user }) {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(1);
  const [clientSecret, setClientSecret] = useState(null);
  const [wellData, setWellData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!!user) {
    router.push("/dashboard");
    return <LoadMask />;
  }

  const handleSuccess = (message) => {
    setIsLoading(false);
    setWellData({
      severity: "success",
      message,
    });
  };

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

      const { error, clientSecret } = await http("/auth/register", {
        username,
        email: email.toLowerCase(),
        password,
      });

      if (!!error) {
        setIsLoading(false);
        setWellData({ message: error });
      } else if (!!clientSecret) {
        setClientSecret(clientSecret);
        handleSuccess(REGISTRATION_SUCCESS_MESSAGE);
      }
    } catch (error) {
      setIsLoading(false);
      setWellData({ message: DEFAULT_ERROR_MESSAGE, stack: error });
    }
  };

  const subscribeSubmit = async (stripe, elements) => {
    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.BASE_URL}/registration-success`,
      },
    });

    if (!!error) {
      setIsLoading(false);
      setWellData({ message: DEFAULT_ERROR_MESSAGE, stack: error });
    }
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ maxWidth: "50rem" }}
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
          <p style={{ textAlign: "center" }}>Subscribe</p>
          <SubscribeForm
            subscribeSubmit={subscribeSubmit}
            isLoading={isLoading}
          />
        </Elements>
      ) : null}
    </Grid>
  );
}
