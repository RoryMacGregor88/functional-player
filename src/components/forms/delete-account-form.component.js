import { Button, Typography } from "@mui/material";
import { FormWrapper } from "src/components";

const DeleteAccountForm = () => {
  return (
    <FormWrapper>
      <Typography variant="body1" sx={{ textAlign: "center" }}>
        This action irreversible, are you sure?
      </Typography>
      {/* inputs for email and password */}
      <Button onClick={() => console.log("Clicked")}>
        Permanently delete my account
      </Button>
    </FormWrapper>
  );
};

export default DeleteAccountForm;
