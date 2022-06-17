import { useRouter } from "next/router";

import { Grid, Typography } from "@mui/material";

import { NextImage } from "@/src/components";

export default function Dashboard({ user }) {
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <Grid container direction="column" sx={{ width: "100%" }}>
      <Grid
        item
        sx={{
          position: "fixed",
          height: "85vh",
          width: "100%",
          zIndex: -1,
        }}
      >
        <NextImage
          src="/blue-strat-large.jpg"
          alt="test-image"
          objectFit="cover"
          layout="fill"
          quality={100}
        />
      </Grid>
      <Grid item direction="column" sx={{ padding: "1rem" }}>
        <Typography variant="h4">Dashboard</Typography>
        <Typography variant="h4">Logged in as: {user.username}</Typography>
      </Grid>
    </Grid>
  );
}
