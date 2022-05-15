import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { updateHandler } from "src/utils";

import { FormWrapper, Button, PasswordField } from "src/components";

const UpdatePasswordForm = ({ user }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      email: user.email,
      currentPassword,
      newPassword,
    };

    const { error, ok } = await updateHandler({ formData: userData });

    if (!!error) {
      console.log("error: ", error);
    }

    console.log("ok: ", ok);
  };

  return !user ? (
    router.push("/login")
  ) : (
    <>
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <PasswordField
          errors={errors}
          register={register}
          label="Old password"
          name="oldPassword"
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
        <Button type="submit">Submit</Button>
      </FormWrapper>
    </>
  );
};

export default UpdatePasswordForm;
