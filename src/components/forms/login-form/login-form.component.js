import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Button,
  FormWrapper,
  EmailField,
  PasswordField,
} from "@/src/components";

import { loginFormSchema } from "@/src/utils";

/** @param {{ onSubmit: function, isLoading: boolean }} props */
const LoginForm = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <FormWrapper onSubmit={handleSubmit((values) => onSubmit(values))}>
      <EmailField errors={errors} register={register} />
      <PasswordField
        errors={errors}
        register={register}
        label="Password"
        name="password"
      />
      <Button type="submit" loading={isLoading}>
        Submit
      </Button>
    </FormWrapper>
  );
};

export default LoginForm;
