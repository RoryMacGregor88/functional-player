import { useEffect } from 'react';

import { VideoDisplay } from '@/src/components';

import { http } from '@/src/utils';

import { getCourses, getCourseById } from '@/lib';

// strip out styles from copied pages, redo

export const getStaticPaths = async () => {
  const courses = await getCourses();

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
  const { email, subscriptionStatus } = user ?? {};
  const { _id, title, description, videoId, trailerId } = course;

  useEffect(() => {
    if (!!user) {
      // return updatedUser here if you ever use this
      http('/last-watched', { email, _id });
    }
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
      }}
    >
      {subscriptionStatus === 'active' ? (
        <VideoDisplay
          title={title}
          description={description}
          videoId={videoId}
        />
      ) : (
        <VideoDisplay
          title={title}
          description={description}
          videoId={trailerId}
        />
      )}
    </div>
  );
}
