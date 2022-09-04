import NextLink from "next/link";

import { Grid, Typography, Button, ListItem } from "@mui/material";

import { NextImage } from "@/src/components";

const SeriesDisplay = ({ series }) => (
  <Grid container direction="column" component={ListItem}>
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
      <NextLink href={`series/${series.seriesPath}`} passHref>
        <NextImage
          src="/stratocaster-medium.jpg"
          alt="stratocaster"
          layout="fill"
          objectFit="cover"
          priority
        />
      </NextLink>
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
      <NextLink href={`series/${series.seriesPath}`} passHref>
        <Button>View this series</Button>
      </NextLink>
    </Grid>
  </Grid>
);

export default SeriesDisplay;
