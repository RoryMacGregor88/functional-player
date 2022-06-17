import { useForm } from "react-hook-form";

import {
  Button,
  FormWrapper,
  EmailField,
  PasswordField,
} from "@/src/components";

/** @param {{ onSubmit: function, isLoading: boolean }} props */
const LoginForm = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <EmailField errors={errors} register={register} />
      <PasswordField
        errors={errors}
        register={register}
        label="Password"
        name="password"
      />
      <Button
        type="submit"
        disabled={!isDirty || !!Object.keys(errors).length}
        loading={isLoading}
      >
        Submit
      </Button>
    </FormWrapper>
  );
};

export default LoginForm;
