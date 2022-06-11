import { useForm } from "react-hook-form";

import { FormWrapper, Button, PasswordField } from "@/src/components";

/** @param {{handleUpdatePassword: function}} props */
const UpdatePasswordForm = ({ handleUpdatePassword }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const onSubmit = ({ currentPassword, newPassword }) => {
    handleUpdatePassword({ currentPassword, newPassword });
    reset();
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <PasswordField
        errors={errors}
        register={register}
        label="Current password"
        name="currentPassword"
      />
      <PasswordField
        errors={errors}
        register={register}
        label="New password"
        name="newPassword"
        validate
      />
      <PasswordField
        errors={errors}
        register={register}
        label="Confirm new password"
        name="confirmNewPassword"
      />
      <Button type="submit" disabled={!isDirty}>
        Submit
      </Button>
    </FormWrapper>
  );
};

export default UpdatePasswordForm;
