import { forwardRef, RefObject, ReactElement } from 'react';

import { TextField as MuiTextField } from '@mui/material';

interface Props {
  props: unknown;
}

const TextField = (props, ref): ReactElement => (
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

export default forwardRef<RefObject<HTMLButtonElement>, Props>(TextField);
