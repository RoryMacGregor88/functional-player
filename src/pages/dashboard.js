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

// TODO: make real, not fake data
const comingSoonCourse = {
  coursePath: "pride-and-joy",
  seriesPath: "stevie-ray-vaughan",
};

export const getServerSideProps = async (ctx) => ({
  props: { allCourses: await getAllCourses() },
});

const ContinueWatching = ({ course }) => {
  // TODO: will need some kind of wrapper to indicate it's latest watched
  const { title, description, seriesPath, coursePath } = course;
  return (
    <CourseDisplay
      title={title}
      description={description}
      src="/stratocaster-small.jpg"
      alt={title}
      seriesPath={seriesPath}
      coursePath={coursePath}
    />
  );
};

const ComingSoon = ({ course }) => {
  // TODO: same here as continue watching, wrapper
  const { title, description, seriesPath, coursePath } = course;
  return (
    <CourseDisplay
      title={title}
      description={description}
      src="/stratocaster-small.jpg"
      alt={title}
      seriesPath={seriesPath}
      coursePath={coursePath}
    />
  );
};

const LatestCourses = ({ courses }) => (
  <MultiCourseDisplay title="Most Recent Courses: " courses={courses} />
);

const Bookmarks = ({ courses }) => (
  <MultiCourseDisplay title="Your Bookmarks: " courses={courses} />
);

/** @param {{user: object, allCourses: object[] }} props */
export default function Dashboard({ user, allCourses }) {
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return <LoadMask />;
  }

  const lastWatched = allCourses.find(
    (course) => course._id === user.lastWatched
  );

  console.log("lastWatched: ", lastWatched);

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
