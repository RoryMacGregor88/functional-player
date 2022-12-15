import { FC, ReactElement } from 'react';

import { useForm } from 'react-hook-form';

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';

import { FormWrapper, Button, PasswordField } from '@/src/components';

import {
  PASSWORD_REQUIRED_MESSAGE,
  NEW_PASSWORD_REQUIRED_MESSAGE,
  PASSWORD_CONFIRM_REQUIRED_MESSAGE,
  NO_PASSWORD_MATCH_MESSAGE,
  PASSWORD_MIN_LENGTH_MESSAGE,
} from '@/src/utils/constants';

import { UpdatePasswordFormValues } from '@/src/utils/interfaces';

const updatePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required(PASSWORD_REQUIRED_MESSAGE),
  newPassword: Yup.string()
    .required(NEW_PASSWORD_REQUIRED_MESSAGE)
    .min(5, PASSWORD_MIN_LENGTH_MESSAGE),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], NO_PASSWORD_MATCH_MESSAGE)
    .required(PASSWORD_CONFIRM_REQUIRED_MESSAGE),
});

interface Props {
  handleUpdatePassword: (formValues: UpdatePasswordFormValues) => void;
  isLoading: boolean;
}

const UpdatePasswordForm: FC<Props> = ({
  handleUpdatePassword,
  isLoading,
}): ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const isDisabled = !isDirty || !!Object.keys(errors).length;

  return (
    <FormWrapper
      onSubmit={handleSubmit((formValues) => handleUpdatePassword(formValues))}
    >
      <PasswordField
        errors={errors}
        register={register}
        label='Current password'
        name='currentPassword'
      />
      <PasswordField
        errors={errors}
        register={register}
        label='New password'
        name='newPassword'
        validate
      />
      <PasswordField
        errors={errors}
        register={register}
        label='Confirm new password'
        name='confirmNewPassword'
      />
      <Button type='submit' disabled={isDisabled} isLoading={isLoading}>
        Submit
      </Button>
    </FormWrapper>
  );
};

export default UpdatePasswordForm;
