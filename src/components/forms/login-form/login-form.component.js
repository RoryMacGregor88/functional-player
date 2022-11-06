import { useForm } from 'react-hook-form';

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';

import { Typography, Grid } from '@mui/material';

import {
  Button,
  FormWrapper,
  EmailField,
  PasswordField,
  Link,
} from '@/src/components';

import {
  EMAIL_REQUIRED_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from '@/src/utils/constants';

// TODO: move this shit into each form, this is stupid

const loginFormSchema = Yup.object().shape({
  email: Yup.string()
    .email(EMAIL_INVALID_MESSAGE)
    .required(EMAIL_REQUIRED_MESSAGE),
  password: Yup.string().required(PASSWORD_REQUIRED_MESSAGE),
});

/** @param {{ onSubmit: function, isLoading: boolean }} props */
const LoginForm = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isDisabled = !isDirty || !!Object.keys(errors).length;

  return (
    <FormWrapper onSubmit={handleSubmit((values) => onSubmit(values))}>
      <EmailField errors={errors} register={register} />
      <PasswordField
        errors={errors}
        register={register}
        label='Password'
        name='password'
      />
      <Button type='submit' isLoading={isLoading} disabled={isDisabled}>
        Submit
      </Button>
      <Grid container alignItems='center' justifyContent='center'>
        {/* // TODO: fix this (span should be link, theme styles, hover styles) */}
        <Typography variant='body1'>Forgot password?</Typography>
        <Link href={'/reset-password'} passHref>
          <span
            style={{
              cursor: 'pointer',
              borderBottom: '2px solid orange',
              width: 'fit-content',
              marginLeft: '0.5rem',
            }}
          >
            Click here
          </span>
        </Link>
      </Grid>
    </FormWrapper>
  );
};

export default LoginForm;
