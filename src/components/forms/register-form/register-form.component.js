import { useForm } from "react-hook-form";

import { Box } from "@mui/material";

import {
  FormWrapper,
  UsernameField,
  EmailField,
  PasswordField,
  Button,
} from "@/src/components";

/**
 * @param {{
 *  onSubmit: function,
 *  onNextClick: function,
 *  disableSubmitButton: boolean
 *  disableNextButton: boolean
 * }} props
 */
const RegisterForm = ({
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
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // TODO: is Object.keys... required with UseForm

  return (
    <Box sx={{ width: "100%" }} justifyContent="center" alignItems="center">
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
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
        <Button
          type="submit"
          disabled={disableSubmitButton || !!Object.keys(errors).length}
        >
          Submit
        </Button>
      </FormWrapper>
      <Button
        onClick={onNextClick}
        disabled={disableNextButton}
        sx={{ width: "100%" }}
      >
        Next
      </Button>
    </Box>
  );
};

export default RegisterForm;
