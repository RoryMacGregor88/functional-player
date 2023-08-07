import { forwardRef, RefObject, ReactElement } from 'react';

import { InputProps, TextField as MuiTextField, styled } from '@mui/material';

import { FieldError } from 'react-hook-form';

const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  input: {
    WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.default} inset !important`,
    borderRadius: 'none',
  },
}));

interface Props {
  id: string;
  label: string;
  error: FieldError;
  type?: string;
  InputProps?: Partial<InputProps>;
  register?: any;
  autoFocus?: boolean;
  textArea?: boolean;
}

const TextField = (
  {
    id,
    label,
    error,
    type = 'input',
    InputProps,
    register,
    autoFocus = false,
    textArea = false,
  },
  ref
): ReactElement => {
  const regProps = !!register ? { ...register(id) } : {},
    textAreaProps = textArea ? { multiline: true, rows: 5 } : {};
  return (
    <StyledTextField
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
      ref={ref}
      {...regProps}
      {...textAreaProps}
    />
  );
};

export default forwardRef<RefObject<HTMLButtonElement>, Props>(TextField);
