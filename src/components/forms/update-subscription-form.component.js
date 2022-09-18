import { Typography } from "@mui/material";

import { Elements } from "@stripe/react-stripe-js";

import { getStripe, STATUS_LABELS } from "@/src/utils";

import {
  FormWrapper,
  Button,
  Attention,
  SubscribeForm,
} from "@/src/components";

/**
 * @param {{
 *  subscriptionStatus: boolean,
 *  handleUnsubscribe: function,
 *  handleStripeCustomer: function,
 *  handleResubscribe: function,
 *  clientSecret: function,
 *  isLoading: boolean
 * }} props
 */
const UpdateSubscriptionForm = ({
  subscriptionStatus,
  handleUnsubscribe,
  handleStripeCustomer,
  handleResubscribe,
  clientSecret,
  isLoading,
}) => {
  return (
    <>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: "1rem" }}
      >
        Your subscription status:{" "}
        <Attention>
          {!!subscriptionStatus
            ? STATUS_LABELS[subscriptionStatus]
            : "Subscription not found"}
        </Attention>
      </Typography>
      {!!clientSecret ? (
        <Elements stripe={getStripe()} options={{ clientSecret }}>
          <SubscribeForm
            subscribeSubmit={handleResubscribe}
            isLoading={isLoading}
          />
        </Elements>
      ) : subscriptionStatus === "active" ? (
        <FormWrapper onSubmit={handleUnsubscribe}>
          <Button type="submit" loading={isLoading}>
            Cancel Subscription
          </Button>
        </FormWrapper>
      ) : (
        <FormWrapper onSubmit={handleStripeCustomer}>
          <Button type="submit" loading={isLoading}>
            Re-enable Subscription
          </Button>
        </FormWrapper>
      )}
    </>
  );
};

export default UpdateSubscriptionForm;
