import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Box } from "@mui/material";

import {
  FormWrapper,
  UsernameField,
  EmailField,
  PasswordField,
  Button,
} from "@/src/components";

import { registerFormSchema } from "@/src/utils";

/**
 * @param {{
 *  isLoading: boolean,
 *  onSubmit: function,
 *  onNextClick: function,
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
    mode: "onBlur",
    resolver: yupResolver(registerFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Box sx={{ width: "100%" }} justifyContent="center" alignItems="center">
      <FormWrapper onSubmit={handleSubmit((values) => onSubmit(values))}>
        <EmailField errors={errors} register={register} />
        <UsernameField errors={errors} register={register} />
        <PasswordField
          errors={errors}
          register={register}
          label="Password"
          name="password"
          validate
        />
        <PasswordField
          errors={errors}
          register={register}
          label="Confirm password"
          name="confirmPassword"
        />
        <Button type="submit" disabled={disableSubmitButton}>
          Submit
        </Button>
      </FormWrapper>
      <Button
        onClick={onNextClick}
        disabled={disableNextButton}
        loading={isLoading}
        sx={{ width: "100%" }}
      >
        Next
      </Button>
    </Box>
  );
};

export default RegisterForm;
