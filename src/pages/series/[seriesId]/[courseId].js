import { useEffect } from "react";

import { Typography } from "@mui/material";

import { PageWrapper, VideoDisplay, SpacedTitle } from "@/src/components";
import { http } from "@/src/utils";

import { getAllCourses, getCourseById } from "@/src/pages/api/course";

// TODO: strip out styles from copied pages, redo
// TODO: Also, implement continue watching and bookmarking, will be fun

export const getStaticPaths = async () => {
  const courses = await getAllCourses();

  const paths = courses.map((course) => ({
    params: { seriesId: course.seriesPath, courseId: course.coursePath },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const { seriesId, courseId } = params;
  return {
    props: { course: await getCourseById(seriesId, courseId) },
  };
};

export default function Series({ user, course }) {
  const { email, subscriptionStatus } = user;
  const { _id, title, description, videoUrl } = course;

  useEffect(() => {
    http("/update-last-watched", { email, _id });
  }, []);

  return (
    <PageWrapper>
      <SpacedTitle title="Single course page (level 3)" />
      {subscriptionStatus === "active" ? (
        <>
          <Typography variant="h6">This is LIVE version</Typography>
          <VideoDisplay
            title={title}
            description={description}
            videoUrl={videoUrl}
          />
        </>
      ) : (
        <>
          <Typography variant="h6">This is TRAILER version</Typography>
          <VideoDisplay
            title={title}
            description={description}
            videoUrl={videoUrl}
          />
        </>
      )}
    </PageWrapper>
  );
}
