import { useRouter } from "next/router";
import { useState } from "react";
import { Grid, Box } from "@mui/material";

import {
  Stepper,
  RegisterForm,
  SubscribeForm,
  RegistrationFinishView,
  SpacedTitle,
} from "src/components";

export default function Register({ user }) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [insertedId, setInsertedId] = useState(null);

  console.log("insertedId: ", insertedId);

  const onNextClick = () => setActiveStep((prev) => prev + 1);

  const handleFinishClick = () => {
    console.log("Finished!");
  };

  const getView = ({
    activeStep,
    insertedId,
    setInsertedId,
    onNextClick,
    handleFinishClick,
  }) => {
    switch (activeStep) {
      case activeStep === 2:
        return <SubscribeForm insertedId={insertedId} />;
      case activeStep === 3:
        return <RegistrationFinishView handleFinishClick={handleFinishClick} />;
      default:
        return (
          <RegisterForm
            insertedId={insertedId}
            setInsertedId={setInsertedId}
            onNextClick={onNextClick}
          />
        );
    }
  };

  return !!user ? (
    router.push("/dashboard")
  ) : (
    <Grid container direction="column" alignItems="center" wrap="nowrap">
      <SpacedTitle>Register</SpacedTitle>
      <Grid
        item
        component={Box}
        sx={{ minWidth: "50%", height: "100%" }}
        justifyContent="center"
        alignItems="center"
      >
        <Stepper activeStep={activeStep} />
        {getView({
          activeStep,
          insertedId,
          setInsertedId,
          onNextClick,
          handleFinishClick,
        })}
      </Grid>
    </Grid>
  );
}
