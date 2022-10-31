import { useRouter } from "next/router";

import { Grid, Typography } from "@mui/material";

import {
  PageWrapper,
  SpacedTitle,
  CourseDisplay,
  LoadMask,
} from "@/src/components";

import { getAllCourses } from "@/lib";

export const getServerSideProps = async (ctx) => ({
  props: { courses: await getAllCourses() },
});

/** @param {{user: object|null, courses: object[]}} props */
export default function List({ user, courses }) {
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return <LoadMask />;
  }

  const bookmarks = courses.filter((course) =>
    user.bookmarks.includes(course._id)
  );

  return (
    <PageWrapper>
      <SpacedTitle>Your List</SpacedTitle>
      {!bookmarks.length ? (
        <Typography sx={{ textAlign: "center" }}>
          You currently have no saved courses.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {bookmarks.map((course) => (
            <CourseDisplay
              key={course._id}
              course={{ ...course, src: "/stratocaster-small.jpg" }}
            />
          ))}
        </Grid>
      )}
    </PageWrapper>
  );
}
