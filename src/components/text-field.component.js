import { forwardRef } from "react";
import { TextField as MuiTextField, GlobalStyles } from "@mui/material";

// TODO: user agent makes background white

// TODO: maybe theme this, as there are many variants/errors etc

const globalStyles = (
  <GlobalStyles
    styles={{
      input: {
        backgroundColor: "#080808 !important",
        color: "#fff !important",
      },
    }}
  />
);

const TextField = (props, ref) => (
  <>
    {globalStyles}
    <MuiTextField
      fullWidth
      inputProps={{
        sx: {
          WebkitBoxShadow: "none !important",
        },
      }}
      {...props}
      ref={ref}
    />
  </>
);

export default forwardRef(TextField);
