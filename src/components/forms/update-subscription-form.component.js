import { Typography } from "@mui/material";

import { FormWrapper, Button, Attention } from "@/src/components";

const STATUS_LABELS = {
  active: "Active",
  incomplete: "Incomplete",
};

const Unsubscribe = () => (
  <>
    <Button type="submit">Cancel Subscription</Button>
  </>
);

const Resubscribe = () => {
  // TODO: will need stripe Elements wrapper in here again maybe
  return (
    <Button type="submit" onClick={() => console.log("Enable subscription")}>
      Re-enable Subscription
    </Button>
  );
};

/**
 * @param {{
 *  subscriptionStatus: boolean,
 *  handleUnsubscribe: function,
 *  handleResubscribe: function
 * }} props
 */
const UpdateSubscriptionForm = ({
  subscriptionStatus,
  handleUnsubscribe,
  handleResubscribe,
}) => {
  return (
    <>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: "1rem" }}
      >
        Your subscription status:{" "}
        <Attention>{STATUS_LABELS[subscriptionStatus]}</Attention>
      </Typography>
      {subscriptionStatus === "active" ? (
        <FormWrapper onSubmit={handleUnsubscribe}>
          <Unsubscribe
            subscriptionStatus={subscriptionStatus}
            handleUnsubscribe={handleUnsubscribe}
          />
        </FormWrapper>
      ) : (
        <FormWrapper onSubmit={handleResubscribe}>
          <Resubscribe subscriptionStatus={subscriptionStatus} />
        </FormWrapper>
      )}
    </>
  );
};

export default UpdateSubscriptionForm;
