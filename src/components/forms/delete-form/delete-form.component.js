import { useState, useContext } from "react";

import { useRouter } from "next/router";
import { Button, Typography } from "@mui/material";

import { FormWrapper, Well } from "@/src/components";
import { http, DEFAULT_ERROR_MESSAGE, Context } from "@/src/utils";

// TODO: check this works right

const DeleteAccountForm = () => {
  const router = useRouter();
  const {
    ctx: { user },
    updateCtx,
  } = useContext(Context);

  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [wellData, setWellData] = useState(false);

  const handleDelete = async () => {
    const { email, customerId } = user;
    const {
      error,
      ok,
      user: resUser,
    } = await http("/auth/delete", {
      email,
      customerId,
    });

    if (!!error) {
      setWellData({
        message: DEFAULT_ERROR_MESSAGE,
        stack: error,
      });
    }

    if (ok) {
      updateCtx({ user: resUser });
      setWellData({
        severity: "success",
        message: "Your account and subscription have been permanently deleted.",
      });
    }
    router.push("/");
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
