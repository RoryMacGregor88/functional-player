import { useRouter } from "next/router";

import { Grid, Typography } from "@mui/material";

import { getAllCourses } from "lib/course";
import { getAllSeries } from "lib/series";

import {
  HeaderImage,
  PageWrapper,
  SpacedTitle,
  CourseDisplay,
  LoadMask,
} from "@/src/components";

// TODO: make real, not fake data, also all videos need alts and aria labels
const comingSoonCourse = {
  _id: "e522a8af-d60a-456e-986b-332afdd485e0",
  title: "Pride and Joy",
  description: "this is a description of Pride and Joy",
  coursePath: "pride-and-joy",
  seriesPath: "stevie-ray-vaughan",
};

export const getServerSideProps = async (ctx) => {
  const courses = await getAllCourses();
  const series = await getAllSeries();
  return {
    props: { courses, series },
  };
};

/**
 * @param {{
 *  category: string,
 *  children: React.ReactChildren
 * }} props
 */
const CategoryWrapper = ({ category, children }) => (
  <Grid
    container
    direction="column"
    gap={1}
    sx={{
      padding: "2rem 0",
      overflowX: "scroll",
      maxWidth: "90vw",
    }}
  >
    <Typography variant="h4">{category}</Typography>
    <Grid item container justifyContent="flex-start" gap={2} wrap="nowrap">
      {children}
    </Grid>
  </Grid>
);

/** @param {{ course: object }} props */
const ContinueWatching = ({ course }) => (
  <CategoryWrapper category="Continue Watching">
    <CourseDisplay course={{ ...course, src: "/stratocaster-small.jpg" }} />
  </CategoryWrapper>
);

/** @param {{ course: object }} props */
const ComingSoon = ({ course }) => (
  <CategoryWrapper category="Coming Soon">
    <CourseDisplay course={{ ...course, src: "/stratocaster-small.jpg" }} />
  </CategoryWrapper>
);

/** @param {{ course: object }} props */
const LatestCourses = ({ courses }) => (
  <CategoryWrapper category="Latest Courses">
    {courses.map((course) => (
      <CourseDisplay
        key={course._id}
        course={{ ...course, src: "/stratocaster-small.jpg" }}
      />
    ))}
  </CategoryWrapper>
);

/** @param {{ courses: object[] }} props */
const Bookmarks = ({ courses }) => (
  <CategoryWrapper category="Your List">
    {courses.map((course) => (
      <CourseDisplay
        key={course._id}
        course={{ ...course, src: "/stratocaster-small.jpg" }}
      />
    ))}
  </CategoryWrapper>
);

/** @param {{ series: object[] }} props */
const Series = ({ series }) =>
  series.map(({ _id, title, courses }) => (
    <CategoryWrapper category={`${title} series`} key={_id}>
      {courses.map((course) => (
        <CourseDisplay
          key={course._id}
          course={{ ...course, src: "/stratocaster-small.jpg" }}
        />
      ))}
    </CategoryWrapper>
  ));

/**
 * @param {{
 *  user: object|null,
 *  courses: object[]
 *  series: object[]
 * }} props
 */
export default function Dashboard({ user, courses, series }) {
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return <LoadMask />;
  }

  const lastWatched =
    courses.find((course) => course._id === user.lastWatched) ?? null;

  const latestCourses = courses
    ?.sort((a, b) => {
      // TODO: change these to 'creation_date' when you can be arsed
      return a.CreationDate > b.CreationDate ? -1 : 1;
    })
    .slice(0, 5);

  const bookmarks = courses.filter(({ _id }) => user.bookmarks.includes(_id));

  return (
    <Grid container direction="column" sx={{ width: "100%" }}>
      <HeaderImage
        src="/stratocaster"
        alt="stratocaster"
        title="Stratocaster Image"
      />
      <PageWrapper>
        <SpacedTitle>Welcome back, {user.username}</SpacedTitle>
        {!!lastWatched ? <ContinueWatching course={lastWatched} /> : null}
        <ComingSoon course={comingSoonCourse} />
        <LatestCourses courses={latestCourses} />
        {!!bookmarks.length ? <Bookmarks courses={bookmarks} /> : null}
        <Series series={series} />
      </PageWrapper>
    </Grid>
  );
}
