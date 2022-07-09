import { useContext } from "react";

import NextImage from "next/image";
import NextLink from "next/link";

import { Typography, Grid, Box } from "@mui/material";

import { Button, BookmarkIconButton } from "@/src/components";

import {
  http,
  Context,
  DEFAULT_ERROR_MESSAGE,
  BOOKMARK_SUCCESS_REMOVE_MESSAGE,
  BOOKMARK_SUCCESS_ADD_MESSAGE,
} from "@/src/utils";

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
  const { ctx, updateCtx } = useContext(Context);

  const { email, bookmarks: currentBookmarks } = ctx.user ?? {};

  const href = `/series/${seriesPath}/${coursePath}`;
  const isBookmarked = currentBookmarks.includes(_id);

  const handleBookmarkClick = async () => {
    try {
      const bookmarks = isBookmarked
        ? currentBookmarks.filter((b) => b !== _id)
        : [...currentBookmarks, _id];

      const { ok } = await http("/update-bookmarks", {
        email,
        bookmarks,
      });

      if (ok) {
        updateCtx({
          user: { ...ctx.user, bookmarks },
          toastData: {
            message: isBookmarked
              ? BOOKMARK_SUCCESS_REMOVE_MESSAGE
              : BOOKMARK_SUCCESS_ADD_MESSAGE,
          },
        });
      }
    } catch (error) {
      updateCtx({
        toastData: {
          message: DEFAULT_ERROR_MESSAGE,
          severity: "error",
        },
      });
    }
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
        {!!ctx.user ? (
          <BookmarkIconButton
            isBookmarked={isBookmarked}
            handleBookmarkClick={handleBookmarkClick}
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
