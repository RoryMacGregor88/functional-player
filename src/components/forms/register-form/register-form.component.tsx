import { FC, ReactElement } from 'react';

import { useForm } from 'react-hook-form';

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';

import { Box } from '@mui/material';

import {
  FormWrapper,
  UsernameField,
  EmailField,
  PasswordField,
  Button,
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

// TODO: Add link to login if already have an account
// TODO: why NEXT button not yellow?

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
    <Box sx={{ width: '100%' }} justifyContent='center' alignItems='center'>
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
    </Box>
  );
};

export default RegisterForm;
