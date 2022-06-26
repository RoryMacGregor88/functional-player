import { useContext, useState } from "react";

import NextImage from "next/image";
import NextLink from "next/link";

import { Typography, Grid, Box } from "@mui/material";

import { Button, BookmarkIconButton, Toast } from "@/src/components";

import { Context as ctx } from "@/src/utils";

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
  const { user } = useContext(ctx);

  const [snack, setSnack] = useState(false);

  const { isOpen, message, severity } = snack;

  const href = `/series/${seriesPath}/${coursePath}`;
  const isBookmarked = !!user?.bookmarks.includes(_id);

  // TODO: extract all this shit to bookmarks util, need to handle multiple toasts
  const handleBookmarkClick = async () => {
    setSnack({ isOpen: true, message: "Added to list" });

    if (!severity) {
      setSnack({
        isOpen: true,
        message: "Removed from list",
        severity: "error",
      });
    } else {
      setSnack({ isOpen: true, message: "Added to list" });
    }
    // try {
    //   const { email, bookmarks: currentBookmarks } = user;

    //   const bookmarks = isBookmarked
    //     ? currentBookmarks.filter((id) => id !== _id)
    //     : { ...currentBookmarks, _id };

    //   const { ok } = await http("/bookmark", { email, bookmarks });

    //   if (ok) {
    //   }
    // } catch (error) {

    // }
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
      <Toast
        open={isOpen}
        message={message}
        severity={severity}
        onClose={() => setSnack(false)}
      />
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
