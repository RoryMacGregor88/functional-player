import { forwardRef } from "react";
import { Button as MuiButton } from "@mui/material";
import { LoadingSpinner } from "@/src/components";

// TODO: disabled ? <span style={{cursor: 'not-allowed'}}>{component}</span>

/**
 * @param {{
 *  disabled?: boolean
 *  loading?: boolean
 *  children: React.ReactChildren
 *  props: any
 * }} props
 */
const Button = (
  { disabled = false, loading = false, children, ...props },
  ref
) => (
  <MuiButton
    ref={ref}
    sx={{
      margin: "0.5rem 0",
      padding: "0.5rem 0",
      width: "100%",
      textAlign: "center",
      backgroundColor: "primary.main",
      color: "background.paper",
    }}
    disabled={disabled}
    {...props}
  >
    {loading ? (
      <LoadingSpinner
        sx={{
          width: "1.5rem !important",
          height: "1.5rem !important",
          alignSelf: "center",
          color: "background.paper",
        }}
      />
    ) : (
      children
    )}
  </MuiButton>
);

export default forwardRef(Button);
