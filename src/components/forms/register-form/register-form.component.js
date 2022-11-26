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

// TODO: make submit handler like login, error.length, dirty etc. And also add link to login if already have an account

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

/**
 * @param {{
 *  isLoading: boolean
 *  onSubmit: function
 *  onNextClick: function
 *  disableSubmitButton: boolean
 *  disableNextButton: boolean
 * }} props
 */
const RegisterForm = ({
  isLoading,
  onSubmit,
  onNextClick,
  disableSubmitButton,
  disableNextButton,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
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

  // TODO: why NEXT button not yellow?

  return (
    <Box sx={{ width: '100%' }} justifyContent='center' alignItems='center'>
      <FormWrapper onSubmit={handleSubmit((values) => onSubmit(values))}>
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
          disabled={disableSubmitButton}
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
