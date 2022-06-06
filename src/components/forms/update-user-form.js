import { useForm } from "react-hook-form";

import { Button } from "@mui/material";

import { FormWrapper, UsernameField, EmailField } from "@/src/components";

const UpdateUserForm = ({ user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      username: user.username,
      email: user.email,
    },
  });

  const onSubmit = (values) => {
    console.log("values: ", values);
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <EmailField errors={errors} register={register} />
      <UsernameField errors={errors} register={register} />
      <Button type="submit">Submit</Button>
    </FormWrapper>
  );
};

export default UpdateUserForm;
