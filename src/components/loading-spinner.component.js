import { CircularProgress } from "@mui/material";
import { THEME_COLORS } from "@/src/utils";

/** @param {{sx: object}} props */
const LoadingSpinner = ({ sx = {} }) => (
  <CircularProgress
    data-testid="loading-spinner"
    // Color is not from theme because spinner
    // in app is outside ThemeProvider
    sx={{ color: THEME_COLORS.yellow, ...sx }}
  />
);

export default LoadingSpinner;
