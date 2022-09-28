import NextImage from "next/image";

import { Grid, Typography, Button } from "@mui/material";

import { Link } from "@/src/components";

const SeriesDisplay = ({ series }) => (
  <Grid item container direction="column">
    <Grid
      item
      sx={{
        position: "relative",
        height: "30rem",
        width: "100%",
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: 1,
        border: "2px solid transparent",
        "&:hover": {
          border: "2px solid",
          borderColor: "primary.main",
        },
      }}
    >
      <Link href={`series/${series.seriesPath}`} passHref>
        <NextImage
          src="/stratocaster-medium.jpg"
          alt="stratocaster"
          layout="fill"
          objectFit="cover"
          priority
        />
      </Link>
    </Grid>
    <Grid
      item
      sx={{
        margin: "2rem 0",
        width: "100%",
      }}
    >
      <Typography variant="h3">{series.title}</Typography>
      <Typography>{series.description}</Typography>
      <Link href={`series/${series.seriesPath}`} passHref>
        <Button>View this series</Button>
      </Link>
    </Grid>
  </Grid>
);

export default SeriesDisplay;
