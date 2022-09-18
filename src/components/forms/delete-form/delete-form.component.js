import { useState } from "react";

import { useRouter } from "next/router";
import { Button, Typography } from "@mui/material";

import { FormWrapper, Well } from "@/src/components";
import { http, DEFAULT_ERROR_MESSAGE } from "@/src/utils";

/** @param {{user: object}} props */
const DeleteAccountForm = ({ user }) => {
  const router = useRouter();

  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [wellData, setWellData] = useState(false);

  const handleDelete = async () => {
    try {
      const { email, customerId } = user;
      const { ok } = await http("/auth/delete", { email, customerId });

      if (ok) {
        setWellData({
          severity: "success",
          message:
            "Your account and subscription have been permanently deleted.",
        });
      }
      router.push("/");
    } catch (error) {
      setWellData({ message: DEFAULT_ERROR_MESSAGE, stack: error });
    }
  };

  return (
    <FormWrapper>
      <Typography sx={{ textAlign: "center" }}>
        Click below to delete your account
      </Typography>
      {!!wellData ? <Well {...wellData} /> : null}
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
