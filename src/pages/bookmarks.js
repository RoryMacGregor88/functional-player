import { useRouter } from "next/router";

import { Grid, Typography } from "@mui/material";

import {
  PageWrapper,
  SpacedTitle,
  CourseDisplay,
  LoadMask,
} from "@/src/components";

import { getAllCourses } from "@/src/pages/api/course";

// TODO: this works, but is a dedicated endpoint better, or just unneeded complication?
export const getServerSideProps = async (ctx) => ({
  props: { courses: await getAllCourses() },
});

/** @param {{user: object}} props */
export default function Bookmarks({ user, courses }) {
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return <LoadMask />;
  }

  const bookmarks = courses.filter((course) =>
    user.bookmarks.includes(course._id)
  );

  console.log("bookmarks: ", bookmarks);

  return (
    <PageWrapper>
      <SpacedTitle>Your Bookmarks</SpacedTitle>
      {!bookmarks.length ? (
        <Typography sx={{ textAlign: "center" }}>
          You currently have no bookmarks
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {bookmarks.map(
            ({ _id, title, description, seriesPath, coursePath }) => (
              <CourseDisplay
                key={_id}
                title={title}
                description={description}
                src="/stratocaster-small.jpg"
                alt="some alt text"
                seriesPath={seriesPath}
                coursePath={coursePath}
              />
            )
          )}
        </Grid>
      )}
    </PageWrapper>
  );
}
