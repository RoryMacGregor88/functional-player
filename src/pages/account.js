import { useState } from "react";
import { useRouter } from "next/router";
import { Tabs, Tab, Box } from "@mui/material";

import {
  SpacedTitle,
  UpdatePasswordForm,
  DeleteAccountForm,
  UpdateSubscriptionForm,
  UpdateEmailForm,
  Well,
  LoadMask,
} from "@/src/components";

import { http, DEFAULT_ERROR_MESSAGE } from "@/src/utils";

/**
 * @param {{
 *  name: string,
 *  value: number,
 *  index: number,
 *  children: React.ReactChildren
 * }} props
 */
const TabPanel = ({ name, value, index, children }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`${name}-tab`}
    aria-labelledby={`${name}-tab`}
  >
    {value === index ? children : null}
  </Box>
);

/**
 * @param {{
 *  user: object,
 *  updateCtx: function
 * }} props
 */
export default function Account({ user, updateCtx }) {
  const router = useRouter();

  const [value, setValue] = useState(0);
  const [wellData, setWellData] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    router.push("/login");
    return <LoadMask />;
  }

  const { email, username, subscriptionStatus, customerId } = user;

  const handleSuccess = (message) => {
    setIsLoading(false);
    setWellData({
      severity: "success",
      message,
    });
  };

  const handleError = (error) => {
    setIsLoading(false);
    setWellData({ message: DEFAULT_ERROR_MESSAGE, stack: error });
  };

  const handleTabChange = (_, newValue) => {
    if (!!wellData) {
      setWellData(null);
    }
    setValue(newValue);
  };

  const handleUpdateEmail = async (values) => {
    setIsLoading(true);

    const { error, ok } = await http("/auth/update-email", {
      email,
      newEmail: values.email.toLowerCase(),
    });

    if (!!error) {
      handleError(error);
    } else if (ok) {
      handleSuccess("Your email has been successfully updated.");
    }
  };

  const handleUpdatePassword = async (values) => {
    setIsLoading(true);

    const formData = {
      email: user.email,
      ...values,
    };

    const { error, ok } = await http("/auth/update-password", formData);

    if (!!error) {
      handleError(error);
    } else if (ok) {
      handleSuccess("Your password has been successfully updated.");
    }
  };

  const handleUnsubscribe = async (e) => {
    setIsLoading(true);

    const { error, ok, user } = await http("/auth/unsubscribe", {
      email,
      customerId,
    });

    if (!!error) {
      handleError(error);
    } else if (ok) {
      // TODO: do Well better, how to have Attention passed as 'message'?
      updateCtx({ user });
      handleSuccess(
        "Your subscription has been successfully cancelled. You can re-activate your subscription any time by clicking the 'RE-ENABLE SUBSCRIPTION' button below."
      );
    }
  };

  const handleStripeCustomer = async () => {
    setIsLoading(true);

    const { error, clientSecret } = await http("/auth/resubscribe", {
      username,
      email,
    });

    if (!!error) {
      handleError(error);
    } else if (!!clientSecret) {
      setIsLoading(false);
      setClientSecret(clientSecret);
    }
  };

  const handleResubscribe = async (stripe, elements) => {
    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.BASE_URL}/reactivation-success`,
      },
    });

    if (!!error) {
      handleError(error);
    }
  };

  // TODO: pagewrapper?

  return (
    <div>
      <SpacedTitle>Account Settings</SpacedTitle>
      {!!wellData && !clientSecret ? <Well {...wellData} /> : null}
      <Tabs
        value={value}
        onChange={handleTabChange}
        aria-label="account and subscription tabs"
        indicatorColor="primary"
        centered
        sx={{ marginBottom: "2rem" }}
      >
        <Tab label="Account Settings" />
        <Tab label="My Subscription" />
        <Tab label="Update Password" />
        <Tab label="Delete Account" />
      </Tabs>

      <TabPanel name="update-user" value={value} index={0}>
        <UpdateEmailForm handleUpdateEmail={handleUpdateEmail} />
      </TabPanel>
      <TabPanel name="update-subscription" value={value} index={1}>
        <UpdateSubscriptionForm
          subscriptionStatus={subscriptionStatus}
          handleUnsubscribe={handleUnsubscribe}
          handleStripeCustomer={handleStripeCustomer}
          handleResubscribe={handleResubscribe}
          clientSecret={clientSecret}
          isLoading={isLoading}
        />
      </TabPanel>
      <TabPanel name="update-user" value={value} index={2}>
        <UpdatePasswordForm handleUpdatePassword={handleUpdatePassword} />
      </TabPanel>
      <TabPanel name="delete-account" value={value} index={3}>
        <DeleteAccountForm user={user} />
      </TabPanel>
    </div>
  );
}
