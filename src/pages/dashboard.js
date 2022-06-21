import { useRouter } from "next/router";

import { Grid } from "@mui/material";

import { getAllCourses } from "@/src/pages/api/course";

import {
  HeaderImage,
  PageWrapper,
  SpacedTitle,
  CourseDisplay,
  MultiCourseDisplay,
} from "@/src/components";

const tempUser = {
  user_name: "John Smith",
  lastWatched: {
    seriesPath: "stevie-ray-vaughan",
    coursePath: "pride-and-joy",
  },
  bookmarks: [
    "e522a8af-d60a-456e-986b-332afdd485e0",
    "d7281f32-e007-48cb-a5db-a2f25acd5991",
    "05173b44-be77-4ef0-b263-444163a509c8",
  ],
};

export const getServerSideProps = async (ctx) => ({
  props: { allCourses: await getAllCourses() },
});

const ContinueWatching = ({ course }) => {
  const { seriesPath, coursePath } = course;
  return (
    <CourseDisplay
      title="Continue Watching: "
      src="/stratocaster-small.jpg"
      alt="This is some alt text"
      seriesPath={seriesPath}
      coursePath={coursePath}
    />
  );
};

const ComingSoon = ({ course }) => {
  // TODO: fix, course not being used
  return (
    <CourseDisplay
      title="Coming Soon: "
      src="/stratocaster-small.jpg"
      alt="This is some alt text"
      coursePath="pride-and-joy"
      seriesPath="stevie-ray-vaughan"
    />
  );
};

const LatestCourses = ({ courses }) => (
  <MultiCourseDisplay title="Most Recent Courses: " courses={courses} />
);

const Bookmarks = ({ courses }) => (
  <MultiCourseDisplay title="Your Bookmarks: " courses={courses} />
);

export default function Dashboard({ user, allCourses }) {
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
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
          <ComingSoon course={{}} />
          <LatestCourses courses={latestCourses} />
          <Bookmarks courses={bookmarks} />
        </Grid>
      </PageWrapper>
    </Grid>
  );
}
