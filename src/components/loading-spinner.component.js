import { Backdrop, CircularProgress } from "@mui/material";

// TODO: color is broken

const LoadingSpinner = () => (
  <Backdrop open sx={{ backgroundColor: "#080808", zIndex: "1000" }}>
    <CircularProgress />
  </Backdrop>
);

export default LoadingSpinner;
