import NextImage from "next/image";
import NextLink from "next/link";

import { Grid, Typography } from "@mui/material";

import { Button } from "@/src/components";

/**
 * @param {{
 *  title: string,
 *  description: string,
 *  seriesPath: string,
 *  coursePath: string
 * }} props
 */
const MiniCourseDisplay = ({ course }) => {
  const { title, description, seriesPath, coursePath } = course;
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
              alt="stratocaster"
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
const MultiCourseDisplay = ({ title, courses }) => (
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
    {courses.map(({ _id, ...course }) => (
      <MiniCourseDisplay key={_id} course={course} />
    ))}
  </Grid>
);

export default MultiCourseDisplay;
