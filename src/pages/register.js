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

import { getStripe, http, DEFAULT_ERROR_MESSAGE } from "@/src/utils";

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

  const onNextClick = () => {
    setActiveStep(2);
    setWellData(null);
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

      setIsLoading(false);

      if (!!error) {
        setWellData({ message: error });
      } else if (!!clientSecret) {
        setClientSecret(clientSecret);
        setWellData({
          severity: "success",
          message:
            'Account successfully created. Click "Next" button to continue.',
        });
      }
    } catch (error) {
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
          <SubscribeForm setWellData={setWellData} />
        </Elements>
      ) : null}
    </Grid>
  );
}
