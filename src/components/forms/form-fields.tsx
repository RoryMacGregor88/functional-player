import { useState, FC, ReactElement } from 'react';

import { InputAdornment } from '@mui/material';

import { FieldError, UseFormRegister } from 'react-hook-form';

import {
  TextField,
  IconButton,
  VisibilityIcon,
  VisibilityOffIcon,
} from '@/src/components';

interface EmailProps {
  error: FieldError;
  register: UseFormRegister<any>;
}

const EmailField: FC<EmailProps> = ({ error, register }): ReactElement => (
  <TextField
    label='Email'
    id='email'
    type='email'
    error={error}
    {...register('email')}
    autoFocus
  />
);

interface ConfirmEmailProps {
  error: FieldError;
  register: UseFormRegister<any>;
}

// TODO: not being used anywhere, delete or use?
const ConfirmEmailField: FC<ConfirmEmailProps> = ({
  error,
  register,
}): ReactElement => (
  <TextField
    label='Confirm email'
    id='confirmEmail'
    type='email'
    error={error}
    {...register('confirmEmail')}
  />
);

interface UsernameProps {
  error: FieldError;
  register: UseFormRegister<any>;
}

const UsernameField: FC<UsernameProps> = ({
  error,
  register,
}): ReactElement => (
  <TextField
    label='username'
    id='username'
    error={error}
    {...register('username')}
  />
);

interface PasswordProps {
  error: FieldError;
  register: UseFormRegister<any>;
  label: string;
  name: string;
}

const PasswordField: FC<PasswordProps> = ({
  error,
  register,
  label,
  name,
}): ReactElement => {
  const [showPassword, setShowPassword] = useState(false);

  // TODO: this is broke, negative margin -12px being implemented somewhere
  // is this fixed now that that prop was removed?
  const iconStyles = { marginRight: '1rem', color: 'palette.primary.main' };
  return (
    <TextField
      label={label}
      id={name}
      type={showPassword ? 'input' : 'password'}
      error={error}
      InputProps={{
        role: 'textbox',
        'aria-label': label,
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <VisibilityOffIcon sx={iconStyles} />
              ) : (
                <VisibilityIcon sx={iconStyles} />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...register(name)}
    />
  );
};

export { UsernameField, EmailField, ConfirmEmailField, PasswordField };
