import { Stepper as MuiStepper, Step, StepLabel } from "@mui/material";

const STEPS = ["Create an account", "Subscribe"];

const Stepper = (activeStep) => {
  return (
    <MuiStepper activeStep={activeStep}>
      {STEPS.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </MuiStepper>
  );
};

export default Stepper;
