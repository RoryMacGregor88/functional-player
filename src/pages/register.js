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
} from "@/src/components";

import { getStripe } from "@/src/utils";

export default function Register({ user }) {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(1);
  const [clientSecret, setClientSecret] = useState(null);
  const [wellData, setWellData] = useState(null);

  const onNextClick = () => {
    setActiveStep(2);
    setWellData(null);
  };

  if (!!user) {
    router.push("/dashboard");
    return null;
  }

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
          setClientSecret={setClientSecret}
          onNextClick={onNextClick}
          setWellData={setWellData}
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
