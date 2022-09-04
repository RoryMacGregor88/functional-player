import { useContext } from "react";

import NextImage from "next/image";
import NextLink from "next/link";

import { Typography, Grid, Box } from "@mui/material";

import { Button, BookmarkIconButton } from "@/src/components";

import { updateBookmarks } from "@/src/utils";

import { Context } from "@/src/utils";

// TODO: styling of this is broke, height width, now that description has been added

/**
 * @param {{
 *  _id: string,
 *  title: string,
 *  description: string,
 *  src: string,
 *  alt: string,
 *  seriesPath: string,
 *  coursePath: string
 * }} props
 */
const CourseDisplay = ({
  _id,
  title,
  description,
  src,
  alt,
  seriesPath,
  coursePath,
}) => {
  const {
    ctx: { user },
    updateCtx,
  } = useContext(Context);

  const isBookmarked = user.bookmarks.includes(_id);

  const href = `/series/${seriesPath}/${coursePath}`;

  const onBookmarkClick = () => {
    updateBookmarks(_id, user, updateCtx);
  };

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
        {!!user ? (
          <BookmarkIconButton
            isBookmarked={isBookmarked}
            onBookmarkClick={onBookmarkClick}
          />
        ) : null}
      </Grid>
      <Box
        sx={{
          position: "relative",
          height: "25rem",
          width: "100%",
          marginBottom: "1rem",
          cursor: "pointer",
          borderRadius: 1,
          overflow: "hidden",
          border: "2px solid transparent",
          "&:hover": {
            border: "2px solid",
            borderColor: "palette.main",
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
