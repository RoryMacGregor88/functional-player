import { useState } from "react";

import { useRouter } from "next/router";

import { Grid } from "@mui/material";

import { http, DEFAULT_ERROR_MESSAGE } from "@/src/utils";
import { LoginForm, SpacedTitle, Well, LoadMask } from "@/src/components";

/**
 * @param {{
 *  user: object|null
 *  updateCtx: function
 * }} props
 */
export default function Login({ user, updateCtx }) {
  const router = useRouter();

  const [wellData, setWellData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!!user) {
    router.push("/dashboard");
    return <LoadMask />;
  }

  const onSubmit = async (event) => {
    setIsLoading(true);
    try {
      const { email, password } = event;
      const { error, resUser } = await http("/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      if (!!error) {
        setWellData({ message: error.message });
      } else if (!!resUser) {
        updateCtx({ user: resUser });
        router.push("/dashboard");
      }
    } catch (e) {
      setWellData({ message: DEFAULT_ERROR_MESSAGE });
    }
    setIsLoading(false);
  };

  // TODO: no PageWrapper. Make consistent, check others
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ maxWidth: "50rem" }}
    >
      <SpacedTitle>Login</SpacedTitle>
      {!!wellData ? <Well {...wellData} /> : null}
      <LoginForm onSubmit={onSubmit} isLoading={isLoading} />
    </Grid>
  );
}
