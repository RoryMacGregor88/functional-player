import { useForm } from "react-hook-form";

import { registerHandler } from "src/utils";

import {
  FormWrapper,
  UsernameField,
  EmailField,
  PasswordField,
} from "src/components";

import { Button } from "../..";

const RegisterForm = ({ insertedId, setInsertedId, onNextClick }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm();

  const shouldDisable = !insertedId || !isDirty || !!Object.keys(errors).length;

  const onSubmit = async (event) => {
    const { username, email, password } = event;

    const { error, insertedId } = await registerHandler({
      username,
      email: email.toLowerCase(),
      password,
    });

    if (!!error) {
      console.log("There was an error: ", error);
      return;
    }

    setInsertedId(insertedId);
  };

  return (
    <>
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
        <Button type="submit" disabled={shouldDisable || !!insertedId}>
          Submit
        </Button>
      </FormWrapper>
      <Button
        onClick={onNextClick}
        disabled={shouldDisable}
        sx={{ width: "100%" }}
      >
        Next
      </Button>
    </>
  );
};

export default RegisterForm;
