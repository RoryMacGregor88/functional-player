import { Button } from "@/src/components";

const SubscribeForm = ({ insertedId, onNextClick }) => {
  // call subscribe handler
  // create subscription and save subscriptionId to created user
  return (
    <form onSubmit={onNextClick}>
      <p>Subscribe</p>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default SubscribeForm;
