import { FC, ReactElement } from 'react';

import { useForm } from 'react-hook-form';

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';

import { Grid, Typography } from '@mui/material';

import {
  FormWrapper,
  UsernameField,
  EmailField,
  PasswordField,
  Button,
  Link,
  LinkButton,
} from '@/src/components';

import {
  EMAIL_REQUIRED_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  USERNAME_REQUIRED_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
  NO_PASSWORD_MATCH_MESSAGE,
  PASSWORD_MIN_LENGTH_MESSAGE,
  PASSWORD_CONFIRM_REQUIRED_MESSAGE,
} from '@/src/utils/constants';

import { RegisterFormValues } from '@/src/utils/interfaces';

const registerFormSchema = Yup.object().shape({
  email: Yup.string()
    .email(EMAIL_INVALID_MESSAGE)
    .required(EMAIL_REQUIRED_MESSAGE),
  username: Yup.string().required(USERNAME_REQUIRED_MESSAGE),
  password: Yup.string()
    .required(PASSWORD_REQUIRED_MESSAGE)
    .min(5, PASSWORD_MIN_LENGTH_MESSAGE),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], NO_PASSWORD_MATCH_MESSAGE)
    .required(PASSWORD_CONFIRM_REQUIRED_MESSAGE),
});

interface Props {
  isLoading: boolean;
  handleRegister: (formValues: RegisterFormValues) => void;
  onNextClick: () => void;
  disableSubmitButton: boolean;
  disableNextButton: boolean;
}

const RegisterForm: FC<Props> = ({
  isLoading,
  handleRegister,
  onNextClick,
  disableSubmitButton,
  disableNextButton,
}): ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(registerFormSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const isDisabled = !isDirty || !!Object.keys(errors).length;

  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
      sx={{ width: '100%' }}
    >
      <FormWrapper
        onSubmit={handleSubmit((formValues) => handleRegister(formValues))}
      >
        <EmailField errors={errors} register={register} />
        <UsernameField errors={errors} register={register} />
        <PasswordField
          errors={errors}
          register={register}
          label='Password'
          name='password'
          validate
        />
        <PasswordField
          errors={errors}
          register={register}
          label='Confirm password'
          name='confirmPassword'
        />
        <Button
          type='submit'
          disabled={disableSubmitButton || isDisabled}
          isLoading={isLoading}
        >
          Submit
        </Button>
      </FormWrapper>
      <Button
        onClick={onNextClick}
        disabled={disableNextButton}
        sx={{ width: '100%' }}
      >
        Next
      </Button>
      <Grid container alignItems='center' justifyContent='center'>
        {/* // TODO: fix this (span should be link, theme styles, hover styles) */}
        <Typography variant='body1'>Already registered?</Typography>
        <Link href={'/login'} passHref>
          <LinkButton>Sign in</LinkButton>
        </Link>
      </Grid>
    </Grid>
  );
};

export default RegisterForm;
