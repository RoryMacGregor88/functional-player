import { useState } from "react";

import { useRouter } from "next/router";

import { Grid } from "@mui/material";

import { http, DEFAULT_ERROR_MESSAGE } from "@/src/utils";
import { LoginForm, SpacedTitle, Well } from "@/src/components";

export default function Login({ user }) {
  const router = useRouter();
  const [wellData, setWellData] = useState(null);

  const onSubmit = async (event) => {
    try {
      const { email, password } = event;
      const { error, ok } = await http("/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      if (!!error) {
        setWellData({ message: error });
      } else if (ok) {
        // TODO: not redirecting anymore, was working
        router.push("/dashboard");
      }
    } catch (error) {
      setWellData({ message: DEFAULT_ERROR_MESSAGE, stack: error });
    }
  };

  if (!!user) {
    router.push("/dashboard");
  }

  return !!user ? null : (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ maxWidth: "50rem" }}
    >
      <SpacedTitle>Login</SpacedTitle>
      {!!wellData ? <Well {...wellData} /> : null}
      <LoginForm onSubmit={onSubmit} />
    </Grid>
  );
}
