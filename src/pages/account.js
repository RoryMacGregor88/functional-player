import { useState } from "react";
import { useRouter } from "next/router";
import { Tabs, Tab, Box } from "@mui/material";

import {
  SpacedTitle,
  UpdatePasswordForm,
  DeleteAccountForm,
  UpdateSubscriptionForm,
  UpdateUserForm,
} from "src/components";

const TabPanel = ({ children, name, value, index }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`${name}-tab`}
    aria-labelledby={`${name}-tab`}
  >
    {value === index ? children : null}
  </Box>
);

export default function Account({ user }) {
  const router = useRouter();
  const [value, setValue] = useState(0);

  return !user ? (
    router.push("/login")
  ) : (
    <div>
      <SpacedTitle>Account Settings</SpacedTitle>
      <Tabs
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
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
        <UpdateUserForm user={user} />
      </TabPanel>
      <TabPanel name="update-subscription" value={value} index={1}>
        <UpdateSubscriptionForm user={user} />
      </TabPanel>

      <TabPanel name="update-user" value={value} index={2}>
        <UpdatePasswordForm user={user} />
      </TabPanel>
      <TabPanel name="delete-account" value={value} index={3}>
        <DeleteAccountForm user={user} />
      </TabPanel>
    </div>
  );
}
