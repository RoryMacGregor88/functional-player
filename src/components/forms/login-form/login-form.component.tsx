import { FC, ReactElement } from 'react';

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
  LinkButton,
} from '@/src/components';

import {
  EMAIL_REQUIRED_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from '@/src/utils/constants';

import { LoginFormValues } from '@/src/utils/interfaces';

const loginFormSchema = Yup.object().shape({
  email: Yup.string()
    .email(EMAIL_INVALID_MESSAGE)
    .required(EMAIL_REQUIRED_MESSAGE),
  password: Yup.string().required(PASSWORD_REQUIRED_MESSAGE),
});

interface Props {
  handleLogin: (formValues: LoginFormValues) => void;
  isLoading: boolean;
}

const LoginForm: FC<Props> = ({ handleLogin, isLoading }): ReactElement => {
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
    <FormWrapper
      onSubmit={handleSubmit((formValues) => handleLogin(formValues))}
    >
      <EmailField error={errors.email} register={register} />
      <PasswordField
        error={errors.password}
        register={register}
        label='Password'
        name='password'
      />
      <Button type='submit' isLoading={isLoading} disabled={isDisabled}>
        Submit
      </Button>
      <Grid
        container
        direction='column'
        alignItems='center'
        justifyContent='center'
      >
        <Grid item container alignItems='center' justifyContent='center'>
          <Typography variant='body1'>Don&apos;t have an account?</Typography>
          <Link href={'/register'}>
            <LinkButton>Sign up</LinkButton>
          </Link>
        </Grid>
        <Grid item container alignItems='center' justifyContent='center'>
          <Typography variant='body1'>Forgot password?</Typography>
          <Link href={'/reset-password'}>
            <LinkButton>Reset</LinkButton>
          </Link>
        </Grid>
      </Grid>
    </FormWrapper>
  );
};

export default LoginForm;
