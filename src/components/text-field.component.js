import { TextField as MuiTextField } from "@mui/material";

// TODO: focused background color is blue for some reason

// TODO: maybe theme this, as there are many variants/errors etc

const TextField = (props) => (
  <MuiTextField
    fullWidth
    inputProps={{
      sx: {
        WebkitBoxShadow: "none !important",
      },
    }}
    {...props}
  />
);

export default TextField;
