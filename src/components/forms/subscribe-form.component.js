import { useForm } from "react-hook-form";
import { Button, FormWrapper } from "@/src/components";

/**
 * @param {{
 *  insertedId: string,
 *  subscribeHandler: function,
 *  onNextClick: function
 * }} props
 */
const SubscribeForm = ({ insertedId, subscribeHandler, onNextClick }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  // types
  const onSubmit = (values) => {
    subscribeHandler({ insertedId, ...values });
  };

  return (
    <>
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <p style={{ textAlign: "center" }}>Subscribe</p>
        <Button type="submit" disabled={!!Object.keys(errors).length}>
          Submit
        </Button>
      </FormWrapper>
      <Button onClick={onNextClick} disabled={false}>
        Next
      </Button>
    </>
  );
};

export default SubscribeForm;
