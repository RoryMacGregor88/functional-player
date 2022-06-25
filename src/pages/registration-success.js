import { useRouter } from "next/router";

import { Grid, Button, Typography, LoadMask } from "@mui/material";

import { Attention } from "@/src/components";

export default function RegistrationSuccess({ user }) {
  const router = useRouter();

  if (!!user) {
    router.push("/dashboard");
    return <LoadMask />;
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Typography variant="h4">
        Thank you, your subscription was successful.
      </Typography>
      <Typography variant="p">
        You can access your account information by clicking the{" "}
        <Attention>My Account</Attention> button in the sidebar.
      </Typography>
      <Typography variant="p">Click the button below to login.</Typography>
      <Button onClick={() => router.push("/login")}>Login</Button>
    </Grid>
  );
}
