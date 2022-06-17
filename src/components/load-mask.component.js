import { Backdrop } from "@mui/material";
import { LoadingSpinner } from "@/src/components";

// TODO: replace backdrop with real logo SVG
// TODO: also fix colors

const LoadMask = () => (
  <Backdrop open sx={{ backgroundColor: "#080808", zIndex: "1000" }}>
    <LoadingSpinner />
  </Backdrop>
);

export default LoadMask;
