import { useRouter } from "next/router";
import React, { useState } from "react";
import { Grid } from "@mui/material";

import {
  Stepper,
  RegisterForm,
  SubscribeForm,
  RegistrationFinishView,
  SpacedTitle,
  Well,
} from "@/src/components";

import { registerHandler, subscribeHandler } from "@/src/utils";

/**
 * @param {{
 *  activeStep: number,
 *  registerSubmit: function,
 *  subscribeHandler: function,
 *  insertedId: string,
 *  onNextClick: function,
 * }} props
 */
const FormView = ({
  setError,
  activeStep,
  registerSubmit,
  subscribeHandler,
  insertedId,
  setInsertedId,
  onNextClick,
}) => {
  if (!activeStep) return null;
  if (activeStep === 1)
    return (
      <RegisterForm
        registerSubmit={registerSubmit}
        setInsertedId={setInsertedId}
        onNextClick={onNextClick}
      />
    );

  if (activeStep === 2)
    return (
      <SubscribeForm
        setError={setError}
        insertedId={insertedId}
        subscribeHandler={subscribeHandler}
        onNextClick={onNextClick}
      />
    );

  if (activeStep === 3) return <RegistrationFinishView />;
};

export default function Register({ user }) {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(1);
  const [insertedId, setInsertedId] = useState(null);
  const [error, setError] = useState(null);

  const onNextClick = () => setActiveStep((prev) => prev + 1);

  const registerSubmit = async (event) => {
    try {
      const { username, email, password } = event;

      const { error, insertedId } = await registerHandler({
        username,
        email: email.toLowerCase(),
        password,
      });

      setInsertedId(insertedId);
    } catch (error) {
      setError({
        title: "Error",
        message: "Something went wrong...",
        stack: error,
      });
    }
  };

  return !!user ? (
    router.push("/dashboard")
  ) : (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ maxWidth: "50rem" }}
    >
      <SpacedTitle>Register</SpacedTitle>
      {!!error ? <Well {...error} /> : null}
      <Stepper activeStep={activeStep} />
      <FormView
        setError={setError}
        activeStep={activeStep}
        registerSubmit={registerSubmit}
        subscribeHandler={subscribeHandler}
        insertedId={insertedId}
        setInsertedId={setInsertedId}
        onNextClick={onNextClick}
      />
    </Grid>
  );
}
