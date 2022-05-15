import { Stepper as MuiStepper, Step, StepLabel } from "@mui/material";

const STEPS = [
  { step: 1, label: "Create account" },
  { step: 2, label: "Subscribe" },
  { step: 3, label: "Finish" },
];

const Stepper = ({ activeStep }) => (
  <MuiStepper
    activeStep={activeStep}
    sx={{
      marginBottom: "2rem",
      minWidth: "50%",
    }}
  >
    {STEPS.map(({ step, label }) => (
      <Step
        key={step}
        active={activeStep === step}
        completed={activeStep > step}
      >
        <StepLabel>{label}</StepLabel>
      </Step>
    ))}
  </MuiStepper>
);

export default Stepper;
