import { CircularProgress } from "@mui/material";

// TODO: theme mapping ('primary.main') not working

const LoadingSpinner = ({ sx = {} }) => (
  <CircularProgress
    data-testid="loading-spinner"
    sx={{ color: "#faf9f7", ...sx }}
  />
);

export default LoadingSpinner;
