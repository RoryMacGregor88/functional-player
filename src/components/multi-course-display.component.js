import { useContext } from "react";

import NextImage from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { Grid, Typography } from "@mui/material";

import { Button, BookmarkIconButton } from "@/src/components";

import { Context, updateBookmarks } from "@/src/utils";

/**
 * @param {{
 *  user: object,
 *  course: object
 *  isBookmarked: boolean,
 *  onBookmarkClick: function
 * }} props
 */
const MiniCourseDisplay = ({ user, course, isBookmarked, onBookmarkClick }) => {
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
            borderRadius: 1,
            overflow: "hidden",
            marginRight: "1rem",
            cursor: "pointer",
            border: "2px solid transparent",
            "&:hover": {
              border: "2px solid",
              borderColor: "primary.main",
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
            onBookmarkClick={onBookmarkClick}
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
  const {
    ctx: { user },
    updateCtx,
  } = useContext(Context);
  const router = useRouter();

  /** @param {string} _id */
  const onBookmarkClick = (_id) => {
    updateBookmarks(_id, user, updateCtx);
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
        const isBookmarked = user.bookmarks.includes(_id);
        return (
          <MiniCourseDisplay
            key={_id}
            user={user}
            course={course}
            isBookmarked={isBookmarked}
            onBookmarkClick={() => onBookmarkClick(_id)}
          />
        );
      })}
    </Grid>
  );
};

export default MultiCourseDisplay;
