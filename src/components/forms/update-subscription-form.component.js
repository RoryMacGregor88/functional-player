import { Typography } from "@mui/material";
import { FormWrapper } from "src/components";

const UpdateSubscriptionForm = ({ user }) => (
  <FormWrapper onSubmit={() => console.log("Submit")}>
    <Typography variant="h4" sx={{ textAlign: "center" }}>
      Subscription status:
      {user.subscriptionIsActive ? " ACTIVE" : " INACTIVE"}
    </Typography>
  </FormWrapper>
);

export default UpdateSubscriptionForm;
