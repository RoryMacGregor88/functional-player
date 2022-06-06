import { useForm } from "react-hook-form";

import { Box } from "@mui/material";

import {
  FormWrapper,
  UsernameField,
  EmailField,
  PasswordField,
  Button,
} from "@/src/components";

import { registerHandler, DEFAULT_ERROR_MESSAGE } from "@/src/utils";

/**
 * @param {{
 *  setClientSecret: function,
 *  onNextClick: function,
 *  setWellData: function,
 *  disableNextButton: boolean
 * }} props
 */
const RegisterForm = ({
  setClientSecret,
  onNextClick,
  setWellData,
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

  const registerSubmit = async (event) => {
    try {
      const { username, email, password } = event;

      const { error, clientSecret } = await registerHandler({
        username,
        email: email.toLowerCase(),
        password,
      });

      if (!!error) {
        setWellData({
          title: "Error",
          message: error,
        });
      } else if (!!clientSecret) {
        setClientSecret(clientSecret);
        setWellData({
          title: "Success!",
          severity: "success",
          message:
            'Account successfully created. Click "Next" button to continue.',
        });
      }
    } catch (error) {
      setWellData({
        title: "Error",
        message: DEFAULT_ERROR_MESSAGE,
        stack: error,
      });
    }
  };

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
        disabled={disableNextButton}
        sx={{ width: "100%" }}
      >
        Next
      </Button>
    </Box>
  );
};

export default RegisterForm;
