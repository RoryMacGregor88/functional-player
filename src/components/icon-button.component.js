import { forwardRef } from "react";
import { IconButton as MuiIconButton } from "@mui/material";

/**
 * @param {{
 *  children: React.ReactChildren
 *  props: any
 * }} props
 */
const IconButton = ({ children, sx = {}, ...props }, ref) => (
  <MuiIconButton
    ref={ref}
    disableRipple
    edge="start"
    color="inherit"
    sx={{ padding: "0", margin: "0", width: "fit-content", ...sx }}
    {...props}
  >
    {children}
  </MuiIconButton>
);

export default forwardRef(IconButton);
