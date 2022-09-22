import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Typography, Grid } from "@mui/material";

import {
  Button,
  FormWrapper,
  EmailField,
  PasswordField,
  Link,
} from "@/src/components";

import { loginFormSchema } from "@/src/utils";

/** @param {{ onSubmit: function, isLoading: boolean }} props */
const LoginForm = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
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
      <Grid container alignItems="center" justifyContent="center">
        {/* // TODO: fix this (span should be ling, theme styles, hover styles) */}
        <Typography variant="body1">Forgot password?</Typography>
        <Link href={"/reset-password"} passHref>
          <span
            style={{
              cursor: "pointer",
              borderBottom: "2px solid orange",
              width: "fit-content",
              marginLeft: "0.5rem",
            }}
          >
            Click here
          </span>
        </Link>
      </Grid>
    </FormWrapper>
  );
};

export default LoginForm;
