import { useForm } from "react-hook-form";

import { Button } from "@mui/material";

import { FormWrapper, EmailField, ConfirmEmailField } from "@/src/components";

/** @param {{handleUpdateEmail: function}} props */
const UpdateEmailForm = ({ handleUpdateEmail }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      email: "",
      confirmEmail: "",
    },
  });

  const onSubmit = (values) => {
    handleUpdateEmail(values);
    reset();
  };

  return (
    <FormWrapper onSubmit={handleSubmit((values) => onSubmit(values))}>
      <EmailField errors={errors} register={register} />
      <ConfirmEmailField errors={errors} register={register} />
      <Button type="submit" disabled={!isDirty}>
        Submit
      </Button>
    </FormWrapper>
  );
};

export default UpdateEmailForm;
