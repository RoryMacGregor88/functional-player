import { Button as MuiButton } from "@mui/material";

/**
 * @param {{
 *  disabled?: boolean
 *  children: string
 *  props: any
 * }} props
 */
const Button = ({ disabled = false, children, ...props }) => (
  <MuiButton
    sx={{
      margin: "0.5rem 0",
      padding: "0.5rem 0",
      width: "100%",
    }}
    disabled={disabled}
    {...props}
  >
    {children}
  </MuiButton>
);

export default Button;
