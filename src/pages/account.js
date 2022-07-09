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

/** @param {{user: object}} props */
export default function Account({ user }) {
  const router = useRouter();

  const [value, setValue] = useState(0);
  const [wellData, setWellData] = useState(null);

  if (!user) {
    router.push("/login");
    return <LoadMask />;
  }

  const { email, subscriptionStatus, subscriptionId } = user;

  const handleTabChange = (_, newValue) => {
    if (!!wellData) {
      setWellData(null);
    }
    setValue(newValue);
  };

  const handleUpdateEmail = async (values) => {
    try {
      const { ok } = await http("/auth/update-email", {
        email,
        newEmail: values.email.toLowerCase(),
      });

      if (ok) {
        setWellData({
          severity: "success",
          message: "Your email has been successfully updated.",
        });
      }
    } catch (error) {
      setWellData({ message: DEFAULT_ERROR_MESSAGE, stack: error });
    }
  };

  const handleUpdatePassword = async (values) => {
    try {
      const formData = {
        email: user.email,
        ...values,
      };

      const { error, ok } = await http("/auth/update-password", formData);

      if (!!error) {
        setWellData({ message: error });
      } else if (ok) {
        setWellData({
          severity: "success",
          message: "Your password has been successfully updated.",
        });
      }
    } catch (error) {
      setWellData({ message: DEFAULT_ERROR_MESSAGE, stack: error });
    }
  };

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    try {
      const { ok } = await http("/auth/unsubscribe", { email, subscriptionId });

      // TODO: do Well better, how to have Attention passed as 'message'?

      if (ok) {
        setWellData({
          severity: "success",
          message:
            "Your subscription has been successfully cancelled. You can re-activate your subscription any time from your Accounts tab.",
        });
      }
    } catch (error) {
      setWellData({ message: DEFAULT_ERROR_MESSAGE, stack: error });
    }
  };

  const handleResubscribe = () => {
    console.log("hit handleResubcribe");
  };

  // TODO: pagewrapper?

  return (
    <div>
      <SpacedTitle>Account Settings</SpacedTitle>
      {!!wellData ? <Well {...wellData} /> : null}
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
          handleResubscribe={handleResubscribe}
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
