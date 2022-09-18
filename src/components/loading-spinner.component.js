import { CircularProgress } from "@mui/material";

/** @param {{sx: object}} props */
const LoadingSpinner = ({ sx = {} }) => (
  <CircularProgress
    data-testid="loading-spinner"
    sx={{ color: "primary.main", ...sx }}
  />
);

export default LoadingSpinner;
