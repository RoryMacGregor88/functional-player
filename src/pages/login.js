import { useRouter } from "next/router";

import { useForm } from "react-hook-form";

import { Grid } from "@mui/material";

import { loginHandler } from "@/src/utils";
import {
  Button,
  SpacedTitle,
  FormWrapper,
  EmailField,
  PasswordField,
} from "@/src/components";

export default function Login({ user }) {
  const router = useRouter();

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

  const onSubmit = async (event) => {
    const { email, password } = event;

    const { error, loggedIn } = await loginHandler({
      email: email,
      password,
    });

    // TODO: try catch
    if (!!error) {
      console.log("Error: ", error);
      return;
    }

    if (loggedIn) {
      router.push("/dashboard");
    }
  };

  return !!user ? (
    router.push("/dashboard")
  ) : (
    <Grid container direction="column" alignItems="center">
      <SpacedTitle>Login</SpacedTitle>
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
        >
          Submit
        </Button>
      </FormWrapper>
    </Grid>
  );
}
