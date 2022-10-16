import { useState } from "react";
import { Button, Typography } from "@mui/material";
import { FormWrapper } from "@/src/components";

// TODO: check this works right, maybe make enter email and password first

/** @param {{ handleDelete: function }} props */
const DeleteAccountForm = ({ handleDelete }) => {
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  return (
    <FormWrapper>
      <Typography sx={{ textAlign: "center" }}>
        Click below to delete your account
      </Typography>
      <Button onClick={() => setShowConfirmButton(true)}>Proceed</Button>
      {showConfirmButton ? (
        <>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            This action is irreversible, are you sure?
          </Typography>
          <Button onClick={handleDelete}>Permanently delete my account</Button>
        </>
      ) : null}
    </FormWrapper>
  );
};

export default DeleteAccountForm;
