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

const ContinueWatching = ({ lastWatched }) => {
  const { seriesPath, coursePath } = lastWatched;
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

const LatestCourses = ({ latestCourses }) => (
  <MultiCourseDisplay title="Most Recent Courses: " courses={latestCourses} />
);

const Bookmarks = ({ bookmarks }) => (
  <MultiCourseDisplay title="Your Bookmarks: " courses={bookmarks} />
);

export default function Dashboard({ user, allCourses }) {
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  const latestCourses = allCourses
    ?.sort((a, b) => {
      // TODO: change these to 'creation_date' when you can be arsed
      return a.CreationDate > b.CreationDate ? -1 : 1;
    })
    .slice(0, 5);

  const bookmarks = allCourses.filter((course) =>
    tempUser.bookmarks.includes(course._id)
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
          <ContinueWatching lastWatched={tempUser.lastWatched} />
          <CourseDisplay
            title="Coming Soon: "
            src="/stratocaster-small.jpg"
            alt="This is some alt text"
            coursePath="pride-and-joy"
            seriesPath="stevie-ray-vaughan"
          />
          <LatestCourses latestCourses={latestCourses} />
          <Bookmarks bookmarks={bookmarks} />
        </Grid>
      </PageWrapper>
    </Grid>
  );
}
