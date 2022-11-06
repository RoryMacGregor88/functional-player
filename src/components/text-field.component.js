import { forwardRef } from 'react';
import { TextField as MuiTextField, GlobalStyles } from '@mui/material';

// TODO: user agent still makes background white

const globalStyles = (
  <GlobalStyles
    styles={{
      input: {
        backgroundColor: 'background.paper !important',
        color: 'primary.main !important',
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
          WebkitBoxShadow: 'none !important',
        },
      }}
      {...props}
      ref={ref}
    />
  </>
);

export default forwardRef(TextField);
