import { forwardRef, RefObject, ReactElement } from 'react';

import { InputProps, TextField as MuiTextField } from '@mui/material';

import { FieldError } from 'react-hook-form';

interface Props {
  id: string;
  label: string;
  error: FieldError;
  type?: string;
  InputProps?: Partial<InputProps> | undefined;
  autoFocus?: boolean;
}

const TextField = (
  { id, label, error, type = 'input', InputProps, autoFocus = false },
  ref
): ReactElement => (
  <MuiTextField
    id={id}
    fullWidth
    variant='outlined'
    label={label}
    name={id}
    type={type}
    aria-describedby={id}
    error={!!error}
    helperText={error?.message}
    autoFocus={autoFocus}
    InputProps={InputProps}
    inputProps={{
      sx: {
        WebkitBoxShadow: 'none !important',
      },
    }}
    ref={ref}
  />
);

export default forwardRef<RefObject<HTMLButtonElement>, Props>(TextField);
