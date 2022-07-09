import { useState } from "react";

import { useRouter } from "next/router";

import { Grid } from "@mui/material";

import { http, DEFAULT_ERROR_MESSAGE } from "@/src/utils";
import { LoginForm, SpacedTitle, Well, LoadMask } from "@/src/components";

/**
 * @param {{
 *  user: object,
 *  fetchToken: function
 * }} props
 */
export default function Login({ user, fetchToken }) {
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
      const { error, ok } = await http("/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      setIsLoading(false);

      if (!!error) {
        setWellData({ message: error });
      } else if (ok) {
        fetchToken();
        router.push("/dashboard");
      }
    } catch (error) {
      setIsLoading(false);
      setWellData({ message: DEFAULT_ERROR_MESSAGE, stack: error });
    }
  };

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
