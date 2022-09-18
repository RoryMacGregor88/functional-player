import { useRouter } from "next/router";

import { Grid } from "@mui/material";

import { getAllCourses } from "@/src/pages/api/course";

import {
  HeaderImage,
  PageWrapper,
  SpacedTitle,
  CourseDisplay,
  MultiCourseDisplay,
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

export const getServerSideProps = async (ctx) => ({
  props: { allCourses: await getAllCourses() },
});

/** @param {{ course: object}} props */
const ContinueWatching = ({ course }) => {
  // TODO: custom component for this? there's only one
  return course ? (
    <CourseDisplay src="/stratocaster-small.jpg" {...course} />
  ) : null;
};

/** @param {{course: object}} props */
const ComingSoon = ({ course }) => {
  // TODO: custom component for this? there's only one
  return <CourseDisplay src="/stratocaster-small.jpg" {...course} />;
};

/** @param {{course: object}} props */
const LatestCourses = ({ courses }) => (
  <MultiCourseDisplay title="Most Recent Courses: " courses={courses} />
);

/** @param {{ course: object}} props */
const Bookmarks = ({ courses }) =>
  courses.length ? (
    <MultiCourseDisplay title="Your Bookmarks: " courses={courses} />
  ) : null;

/**
 * @param {{
 *  user: object,
 *  allCourses: object[]
 * }} props
 */
export default function Dashboard({ user, allCourses }) {
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return <LoadMask />;
  }

  const lastWatched = allCourses.find(
    (course) => course._id === user.lastWatched
  );

  const latestCourses = allCourses
    ?.sort((a, b) => {
      // TODO: change these to 'creation_date' when you can be arsed
      return a.CreationDate > b.CreationDate ? -1 : 1;
    })
    .slice(0, 5);

  const bookmarks = allCourses.filter(({ _id }) =>
    user.bookmarks.includes(_id)
  );

  return (
    <Grid container direction="column" sx={{ width: "100%" }}>
      <HeaderImage
        src="/stratocaster"
        alt="stratocaster"
        title="Stratocaster Image"
      />
      <PageWrapper>
        <SpacedTitle>Welcome back, {user.username}</SpacedTitle>
        <Grid
          container
          justifyContent="space-between"
          alignItems="stretch"
          wrap="wrap"
          spacing={4}
        >
          <ContinueWatching course={lastWatched} />
          <ComingSoon course={comingSoonCourse} />
          <LatestCourses courses={latestCourses} />
          <Bookmarks courses={bookmarks} />
        </Grid>
      </PageWrapper>
    </Grid>
  );
}
