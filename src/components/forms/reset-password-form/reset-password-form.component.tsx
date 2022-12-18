import { FC, ReactElement } from 'react';

import { useForm } from 'react-hook-form';

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';

import { FormWrapper, EmailField, Button } from '@/src/components';

import {
  EMAIL_INVALID_MESSAGE,
  EMAIL_REQUIRED_MESSAGE,
} from '@/src/utils/constants';

const resetPasswordFormSchema = Yup.object().shape({
  email: Yup.string()
    .email(EMAIL_INVALID_MESSAGE)
    .required(EMAIL_REQUIRED_MESSAGE),
});

// TODO: do the other http handlers return promises or just void? Fix.

interface Props {
  handleResetPassword: (values: { email: string }) => Promise<void>;
  isSubmitDisabled: boolean;
  isLoading: boolean;
}

const ResetPasswordForm: FC<Props> = ({
  handleResetPassword,
  isSubmitDisabled,
  isLoading,
}): ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(resetPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const isDisabled = !isDirty || !!Object.keys(errors).length;

  return (
    <FormWrapper
      onSubmit={handleSubmit((values) => handleResetPassword(values))}
    >
      <EmailField error={errors.email} register={register} />
      <Button
        type='submit'
        disabled={isSubmitDisabled || isDisabled}
        isLoading={isLoading}
      >
        Submit
      </Button>
    </FormWrapper>
  );
};

export default ResetPasswordForm;
