import { useContext } from "react";

import NextImage from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { Grid, Typography } from "@mui/material";

import { Button, BookmarkIconButton } from "@/src/components";

import {
  Context,
  BOOKMARK_SUCCESS_ADD_MESSAGE,
  BOOKMARK_SUCCESS_REMOVE_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  http,
} from "@/src/utils";

/**
 * @param {{
 *  user: object,
 *  course: object
 *  isBookmarked: boolean,
 *  handleBookmarkClick: function
 * }} props
 */
const MiniCourseDisplay = ({
  user,
  course,
  isBookmarked,
  handleBookmarkClick,
}) => {
  const { title, alt, description, seriesPath, coursePath } = course;
  const href = `/series/${seriesPath}/${coursePath}`;
  return (
    <Grid item container direction="column" alignItems="center" wrap="nowrap">
      <Grid item container wrap="nowrap">
        <Grid
          item
          sx={{
            position: "relative",
            width: "7.5rem",
            height: "7.5rem",
            borderRadius: "10px", // use theme borderRadius
            overflow: "hidden",
            marginRight: "1rem",
            cursor: "pointer",
            border: "2px solid transparent",
            "&:hover": {
              border: "2px solid #fff", // make theme, was action.hover
            },
          }}
        >
          <NextLink href={href} passHref>
            <NextImage
              src="/stratocaster-small.jpg"
              alt={alt}
              layout="fill"
              objectFit="cover"
            />
          </NextLink>
        </Grid>
        <Grid
          item
          container
          direction="column"
          justifyContent="space-evenly"
          wrap="nowrap"
          sx={{ height: "100%", width: "auto" }}
        >
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body1">{description}</Typography>
        </Grid>
        {!!user ? (
          <BookmarkIconButton
            isBookmarked={isBookmarked}
            handleBookmarkClick={handleBookmarkClick}
            sx={{
              marginLeft: "auto",
              alignSelf: "flex-start",
            }}
          />
        ) : null}
      </Grid>
      <NextLink href={href} passHref>
        <Button>Watch Now</Button>
      </NextLink>
    </Grid>
  );
};

/**
 * @param {{
 *  title: string,
 *  courses: object[],
 * }} props
 */
const MultiCourseDisplay = ({ title, courses }) => {
  const { ctx, updateCtx } = useContext(Context);
  const router = useRouter();

  const { email, bookmarks: currentBookmarks } = ctx.user ?? {};

  const handleBookmarkClick = async (_id, isBookmarked) => {
    if (!ctx.user) {
      return updateCtx({
        dialogData: {
          title: "You must be logged in to bookmark courses.",
          message:
            "Click below to log in or register if you don't already have an account.",
          actions: [
            {
              label: "Login",
              onClick: () => router.push("/login"),
              closeOnClick: true,
            },
            {
              label: "Register",
              onClick: () => router.push("/register"),
              closeOnClick: true,
            },
          ],
        },
      });
    }

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
      justifyContent="flex-start"
      xs={12}
      md={6}
      sx={{ maxWidth: "35rem" }}
    >
      <Typography variant="h4" sx={{ margin: "1rem 0" }}>
        {title}
      </Typography>
      {courses.map(({ _id, ...course }) => {
        const isBookmarked = currentBookmarks?.includes(_id);
        return (
          <MiniCourseDisplay
            key={_id}
            user={ctx.user}
            course={course}
            isBookmarked={isBookmarked}
            handleBookmarkClick={() => handleBookmarkClick(_id, isBookmarked)}
          />
        );
      })}
    </Grid>
  );
};

export default MultiCourseDisplay;
