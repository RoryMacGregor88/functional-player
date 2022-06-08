import { useState } from "react";

import { Typography } from "@mui/material";

import { FormWrapper, Button, Attention, Well } from "@/src/components";
import { DEFAULT_ERROR_MESSAGE, unsubscribeHandler } from "@/src/utils";

const STATUS_LABELS = {
  active: "Active",
};

/**
 * @param {{
 *  subscriptionStatus: string,
 *  handleUnsubscribeSubmit: function
 * }} props
 */
const Unsubscribe = ({ subscriptionStatus, handleUnsubscribeSubmit }) => (
  <>
    <Typography variant="h4" sx={{ textAlign: "center" }}>
      Your subscription status:{" "}
      <Attention>{STATUS_LABELS[subscriptionStatus]}</Attention>
    </Typography>
    <Button type="submit" onClick={handleUnsubscribeSubmit}>
      Cancel Subscription
    </Button>
  </>
);

const Resubscribe = ({ user }) => {
  // TODO: will need stripe Elements wrapper in here again maybe
  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Subscription status: {user.subscriptionStatus}
      </Typography>
      <Button type="submit" onClick={() => console.log("Enable subscription")}>
        Re-enable Subscription
      </Button>
    </>
  );
};

const UpdateSubscriptionForm = ({ user }) => {
  const [wellData, setWellData] = useState(null);

  const handleUnsubscribeSubmit = async () => {
    try {
      const { email, subscriptionId } = user;
      await unsubscribeHandler({ email, subscriptionId });
      setWellData({
        title: "Success.",
        severity: "success",
        // TODO: do this better, how to have Attention passed here?
        message:
          "Your subscription has been successfully cancelled. You can re-activate your subscription any time from your Accounts tab.",
      });
    } catch (error) {
      setWellData({
        title: "Error!",
        message: DEFAULT_ERROR_MESSAGE,
        stack: error,
      });
    }
  };

  return (
    <FormWrapper onSubmit={() => console.log("Submit")}>
      {!!wellData ? <Well {...wellData} /> : null}
      {user.subscriptionStatus === "active" ? (
        <Unsubscribe
          subscriptionId={subscriptionId}
          handleUnsubscribeSubmit={handleUnsubscribeSubmit}
        />
      ) : (
        <Resubscribe user={user} />
      )}
    </FormWrapper>
  );
};

export default UpdateSubscriptionForm;
