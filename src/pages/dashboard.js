import { useRouter } from "next/router";

import { Grid } from "@mui/material";

import { HeaderImage } from "@/src/components";

export default function Dashboard({ user }) {
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <Grid container direction="column" sx={{ width: "100%" }}>
      <HeaderImage
        src="/stratocaster"
        alt="stratocaster"
        title="Stratocaster Image"
      />
      <h1
        style={{
          margin: "2rem",
        }}
      >
        More stuff
      </h1>
    </Grid>
  );
}
