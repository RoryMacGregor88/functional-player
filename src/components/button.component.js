import { Button as MuiButton } from "@mui/material";

/**
 * @param {{
 *  disabled?: boolean
 *  children: string
 * }} props
 */
const Button = ({ disabled = false, children, ...props }) => (
  <MuiButton
    sx={{
      margin: "0.5rem 0",
      padding: "0.5rem",
      width: "100%",
      cursor: disabled ? "not-allowed" : "pointer",
    }}
    disabled={disabled}
    {...props}
  >
    {children}
  </MuiButton>
);

export default Button;
