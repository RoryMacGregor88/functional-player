import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  LoadMask,
  Well,
  FormWrapper,
  PageWrapper,
  SpacedTitle,
  EmailField,
  Button,
} from "@/src/components";

import {
  http,
  DEFAULT_ERROR_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  EMAIL_REQUIRED_MESSAGE,
} from "@/src/utils";

const resetPasswordFormSchema = Yup.object().shape({
  email: Yup.string()
    .email(EMAIL_INVALID_MESSAGE)
    .required(EMAIL_REQUIRED_MESSAGE),
});

export default function ResetPassword({ user }) {
  const router = useRouter();
  const [wellData, setWellData] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(resetPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  if (!!user) {
    router.push("/dashboard");
    return <LoadMask />;
  }

  const onSubmit = async (values) => {
    const { email } = values;

    const { error, message, ok } = await http("/auth/reset-password", {
      email: email.toLowerCase(),
    });

    if (!!message) {
      setWellData({ message });
    } else if (!!error) {
      setWellData({ message: DEFAULT_ERROR_MESSAGE });
    } else if (ok) {
      setIsSubmitDisabled(true);
      setWellData({
        severity: "success",
        message: `An email has been sent to ${email}. Please follow the steps to reset your password. Don't forget to check your junk folder.`,
      });
    }
  };

  return (
    <PageWrapper>
      <SpacedTitle>Reset Password</SpacedTitle>
      <FormWrapper onSubmit={handleSubmit((values) => onSubmit(values))}>
        {!!wellData ? <Well {...wellData} /> : null}
        <EmailField errors={errors} register={register} />
        <Button type="submit" disabled={isSubmitDisabled}>
          Submit
        </Button>
      </FormWrapper>
    </PageWrapper>
  );
}
