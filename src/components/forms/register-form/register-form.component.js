import { useForm } from "react-hook-form";

import { Box } from "@mui/material";

import {
  FormWrapper,
  UsernameField,
  EmailField,
  PasswordField,
} from "@/src/components";

import { Button } from "../..";

/**
 * @param {{
 *  registerSubmit: function
 *  setInsertedId: function
 *  onNextClick: function
 * }} props
 */
const RegisterForm = ({ registerSubmit, setInsertedId, onNextClick }) => {
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
      <FormWrapper onSubmit={handleSubmit(registerSubmit)}>
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
        <Button type="submit" disabled={!!Object.keys(errors).length}>
          Submit
        </Button>
      </FormWrapper>
      <Button
        onClick={onNextClick}
        // disabled={!insertedId}
        sx={{ width: "100%" }}
      >
        Next
      </Button>
    </Box>
  );
};

export default RegisterForm;
