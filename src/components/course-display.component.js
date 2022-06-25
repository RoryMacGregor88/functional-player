import NextImage from "next/image";
import NextLink from "next/link";

import { Typography, Grid, Box } from "@mui/material";

import {
  Button,
  IconButton,
  BookmarkAddIcon,
  BookmarkAddedIcon,
} from "@/src/components";

// TODO: styling of this is broke, height width, now that description has been added

const handleBookmarkClick = () => {
  console.log("clicked bookmark");
};

/**
 * @param {{
 *  title: string,
 *  description: string,
 *  src: string,
 *  alt: string,
 *  seriesPath: string,
 *  coursePath: string
 * }} props
 */
const CourseDisplay = ({
  title,
  description,
  src,
  alt,
  seriesPath,
  coursePath,
}) => {
  const href = `/series/${seriesPath}/${coursePath}`;
  return (
    <Grid
      item
      container
      direction="column"
      sx={{ maxWidth: "35rem", minWidth: "35rem" }}
      xs={12}
      md={6}
    >
      <Grid item container justifyContent="space-between" alignItems="center">
        {/* TODO: put some kind of hover effect on the image and title */}
        <Typography
          variant="h4"
          sx={{
            margin: "1rem 0",
          }}
        >
          {title}
        </Typography>
        <IconButton onClick={handleBookmarkClick}>
          <BookmarkAddIcon sx={{ height: "2rem", width: "2rem" }} />
        </IconButton>
      </Grid>
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
        <Typography>{description}</Typography>
      </Grid>
      <NextLink href={href} passHref>
        <Button>Watch Now</Button>
      </NextLink>
    </Grid>
  );
};

export default CourseDisplay;
