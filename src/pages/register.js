import { useRouter } from "next/router";
import React, { useState } from "react";
import { Grid } from "@mui/material";

import {
  Stepper,
  RegisterForm,
  SubscribeForm,
  SpacedTitle,
  Well,
} from "@/src/components";

import { registerHandler } from "@/src/utils";

export default function Register({ user }) {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(1);
  const [clientSecret, setClientSecret] = useState(null);
  const [wellData, setWellData] = useState(null);

  const onNextClick = () => {
    setActiveStep(2);
    setWellData(null);
  };

  const registerSubmit = async (event) => {
    try {
      const { username, email, password } = event;

      const { error, clientSecret } = await registerHandler({
        username,
        email: email.toLowerCase(),
        password,
      });

      if (!!error) {
        setWellData({
          title: "Error",
          message: error,
        });
      } else if (!!clientSecret) {
        setClientSecret(clientSecret);
        setWellData({
          title: "Success!",
          severity: "success",
          message: 'Account successfully created. Click "Next" to continue.',
        });
      }
    } catch (error) {
      setWellData({
        title: "Error",
        message: "An unexpected error occurred.",
        stack: error,
      });
    }
  };

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

      // something going wrong here, incomplete, not redirecting

      if (!!result.error) {
        setWellData({
          title: "Error",
          message: error,
        });
      }
    } catch (error) {
      setWellData({
        title: "Error",
        message: "An unexpected error occurred.",
        stack: error,
      });
    }
  };

  if (!!user) {
    router.push("/dashboard");
  }

  return !!user ? null : (
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
          registerSubmit={registerSubmit}
          onNextClick={onNextClick}
          disableNextButton={!clientSecret}
        />
      ) : null}
      {activeStep === 2 ? (
        <SubscribeForm
          clientSecret={clientSecret}
          subscribeSubmit={subscribeSubmit}
        />
      ) : null}
    </Grid>
  );
}
