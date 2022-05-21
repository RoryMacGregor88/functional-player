import { useRouter } from "next/router";
import React, { useState } from "react";
import { Grid } from "@mui/material";

import {
  Stepper,
  RegisterForm,
  SubscribeForm,
  RegistrationFinishView,
  SpacedTitle,
} from "@/src/components";

import { registerHandler, subscribeHandler } from "@/src/utils";

/**
 * @param {{
 *  activeStep: number,
 *  registerSubmit: function,
 *  subscribeSubmit: function,
 *  insertedId: string,
 *  onNextClick: function,
 * }} props
 * @returns {React.ReactNode}
 */
const getView = ({
  activeStep,
  registerSubmit,
  subscribeSubmit,
  insertedId,
  onNextClick,
}) => {
  switch (activeStep) {
    case 1:
      return (
        <RegisterForm
          insertedId={insertedId}
          registerSubmit={registerSubmit}
          onNextClick={onNextClick}
        />
      );
    case 2:
      return (
        <SubscribeForm
          insertedId={insertedId}
          subscribeSubmit={subscribeSubmit}
          onNextClick={onNextClick}
        />
      );
    case 3:
      return <RegistrationFinishView />;
    default:
      return null;
  }
};

export default function Register({ user }) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [insertedId, setInsertedId] = useState(null);

  const onNextClick = () => setActiveStep((prev) => prev + 1);

  const registerSubmit = async (event) => {
    const { username, email, password } = event;

    const { error, insertedId } = await registerHandler({
      username,
      email: email.toLowerCase(),
      password,
    });

    if (!!error) {
      console.log("There was an error: ", error);
      return;
    }

    setInsertedId(insertedId);
  };

  const subscribeSubmit = async (event) => {
    subscribeHandler(event);
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
      <Stepper activeStep={activeStep} />
      {getView({
        activeStep,
        registerSubmit,
        subscribeSubmit,
        insertedId,
        setInsertedId,
        onNextClick,
      })}
    </Grid>
  );
}
