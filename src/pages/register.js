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
 *  subscribeHandler: function,
 *  setClientSecret: function,
 *  insertedId: string,
 *  onNextClick: function,
 * }} props
 * @returns {React.ReactNode}
 */
const FormView = ({
  activeStep,
  registerSubmit,
  subscribeHandler,
  setClientSecret,
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
        insertedId={insertedId}
        subscribeHandler={subscribeHandler}
        setClientSecret={setClientSecret}
        onNextClick={onNextClick}
      />
    );

  if (activeStep === 3) return <RegistrationFinishView />;
};

export default function Register({ user, setClientSecret }) {
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
      <FormView
        activeStep={activeStep}
        registerSubmit={registerSubmit}
        subscribeHandler={subscribeHandler}
        setClientSecret={setClientSecret}
        insertedId={insertedId}
        setInsertedId={setInsertedId}
        onNextClick={onNextClick}
      />
    </Grid>
  );
}
