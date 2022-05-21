import { Typography } from "@mui/material";
import { FormWrapper, Button } from "@/src/components";

const Unsubscribe = ({ user }) => (
  <>
    <Typography variant="h4" sx={{ textAlign: "center" }}>
      Subscription status:
      {user.subscriptionIsActive ? " ACTIVE" : " INACTIVE"}
    </Typography>
    <Button type="submit" onClick={() => console.log("Cancel subscription")}>
      Cancel Subscription
    </Button>
  </>
);

const Resubscribe = ({ user }) => (
  <>
    <Typography variant="h4" sx={{ textAlign: "center" }}>
      Subscription status:
      {user.subscriptionIsActive ? " ACTIVE" : " INACTIVE"}
    </Typography>
    <Button type="submit" onClick={() => console.log("Enable subscription")}>
      Re-enable Subscription
    </Button>
  </>
);

const UpdateSubscriptionForm = ({ user }) => (
  <FormWrapper onSubmit={() => console.log("Submit")}>
    {user.subscriptionIsActive ? (
      <Unsubscribe user={user} />
    ) : (
      <Resubscribe user={user} />
    )}
  </FormWrapper>
);

export default UpdateSubscriptionForm;
