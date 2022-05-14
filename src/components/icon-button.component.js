import { IconButton as MuiIconButton } from "@mui/material";

const IconButton = ({ children, ...props }) => (
  <MuiIconButton
    disableRipple
    edge="start"
    color="inherit"
    sx={{ padding: "0" }}
    {...props}
  >
    {children}
  </MuiIconButton>
);

export default IconButton;
