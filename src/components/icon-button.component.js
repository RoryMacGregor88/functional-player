import { IconButton as MuiIconButton } from "@mui/material";

const IconButton = ({ children, ...props }) => (
  <MuiIconButton
    disableRipple
    edge="start"
    color="inherit"
    sx={{ padding: "0", margin: "0", width: "fit-content" }}
    {...props}
  >
    {children}
  </MuiIconButton>
);

export default IconButton;
