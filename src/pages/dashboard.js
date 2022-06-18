import { useRouter } from "next/router";

import { Grid } from "@mui/material";

import { HeaderImage } from "@/src/components";

const user = {
  user_name: "John Smith",
  lastWatched: {
    seriesPath: "stevie-ray-vaughan",
    coursePath: "pride-and-joy",
  },
  bookmarks: [
    "e522a8af-d60a-456e-986b-332afdd485e0",
    "d7281f32-e007-48cb-a5db-a2f25acd5991",
    "05173b44-be77-4ef0-b263-444163a509c8",
  ],
};

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
