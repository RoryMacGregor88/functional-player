import { forwardRef } from 'react';
import { TextField as MuiTextField } from '@mui/material';

const TextField = (props, ref) => (
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
);

export default forwardRef(TextField);
