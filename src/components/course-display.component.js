import NextImage from "next/image";
import NextLink from "next/link";

import { Typography, Grid, Box } from "@mui/material";

import { Button } from "@/src/components";

/**
 * @param {{
 *  title: string,
 *  src: string,
 *  alt: string,
 *  seriesPath: string,
 *  coursePath: string
 * }} props
 */
const CourseDisplay = ({ title, src, alt, seriesPath, coursePath }) => {
  const href = `/series/${seriesPath}/${coursePath}`;
  return (
    <Grid
      item
      container
      direction="column"
      sx={{ maxWidth: "35rem" }}
      xs={12}
      md={6}
    >
      <Typography
        variant="h4"
        sx={{
          margin: "1rem 0",
        }}
      >
        {title}
      </Typography>
      {/* put some kind of hover effect on the image and title */}
      <Box
        sx={{
          position: "relative",
          height: "25rem",
          width: "100%",
          marginBottom: "1rem",
          cursor: "pointer",
          borderRadius: "10px", // use theme borderRadius
          overflow: "hidden",
          border: "2px solid transparent",
          "&:hover": {
            border: `2px solid #fff`, // make theme, was action.hover
          },
        }}
      >
        <NextLink href={href} passHref>
          <NextImage layout="fill" objectFit="cover" src={src} alt={alt} />
        </NextLink>
      </Box>
      <Grid item container direction="column" alignItems="flex-start">
        <Typography>
          This is the description of this video, it is currently hardcoded into
          the component, but will not be when I get around to fixing it.
        </Typography>
      </Grid>
      <NextLink href={href} passHref>
        <Button>Watch Now</Button>
      </NextLink>
    </Grid>
  );
};

export default CourseDisplay;
