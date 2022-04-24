import { useState } from "react";

import { Box } from "@mui/material";

import { Stepper, RegisterForm, SubscribeForm } from "src/components";

const FinishView = () => {
  return <div>You Are finished.</div>;
};

export default function Register() {
  const [activeStep, setActiveStep] = useState(1);
  const [insertedId, setInsertedId] = useState(null);

  console.log("insertedId: ", insertedId);

  const onNextClick = () => setActiveStep((prev) => prev + 1);

  const handleFinishClick = () => {
    console.log("Finished!");
  };

  return (
    <Box
      sx={{ width: "100%", height: "100%" }}
      justifyContent="center"
      alignItems="center"
    >
      <Stepper activeStep={activeStep} />
      {activeStep === 1 ? (
        <RegisterForm
          insertedId={insertedId}
          setInsertedId={setInsertedId}
          onNextClick={onNextClick}
        />
      ) : null}
      {activeStep === 2 ? <SubscribeForm insertedId={insertedId} /> : null}
      {activeStep === 3 ? (
        <FinishView handleFinishClick={handleFinishClick} />
      ) : null}
    </Box>
  );
}
