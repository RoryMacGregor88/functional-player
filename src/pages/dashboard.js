import { useRouter } from "next/router";

import { Grid, Typography } from "@mui/material";

import { getAllCourses } from "lib/course";
import { getAllSeries } from "lib/series";

import {
  HeaderImage,
  PageWrapper,
  CourseDisplay,
  LoadMask,
  Slider,
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
        {/* {!!lastWatched ? <ContinueWatching course={lastWatched} /> : null} */}
        {!!bookmarks.length ? (
          <Slider title="Your List" courses={bookmarks} />
        ) : null}
        <Slider title="Latest Releases" courses={latestCourses} />
        {/* <ComingSoon course={comingSoonCourse} /> */}
        {series.map(({ _id, title, courses }) => (
          <Slider key={_id} title={`${title} Series`} courses={courses} />
        ))}
      </PageWrapper>
    </Grid>
  );
}
