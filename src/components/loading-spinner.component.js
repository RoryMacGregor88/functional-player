import { CircularProgress } from "@mui/material";

const LoadingSpinner = () => (
  <CircularProgress
    data-testid="loading-spinner"
    sx={{ color: "primary.main" }}
  />
);

export default LoadingSpinner;
