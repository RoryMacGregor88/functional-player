import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import { GetServerSideProps } from 'next';

import { Grid, Typography } from '@mui/material';

import {
  PageWrapper,
  SpacedTitle,
  CourseDisplay,
  LoadMask,
} from '@/src/components';

import { Course, User, CustomError } from '@/src/utils/interfaces';

import { getAllCourses } from '@/lib';

interface ServerSideProps {
  props: { error: CustomError } | { courses: Course[] };
}

export const getServerSideProps: GetServerSideProps = async (
  ctx
): Promise<ServerSideProps> => {
  // TODO: make sure this still works since adding token
  const token = ctx.req.cookies[process.env.SESSION_TOKEN_NAME];
  const { courses, error } = await getAllCourses(token);
  return {
    props: !!error ? { error, courses: null } : { error: null, courses },
  };
};

/** @param {{user: object|null, courses: object[]}} props */

interface Props {
  user: User | null;
  courses: Course[] | null;
}

export default function List({ user, courses }: Props): ReactElement {
  const { push } = useRouter();

  if (!user) {
    push('/login');
    return <LoadMask />;
  }

  const bookmarks = courses.filter((course) =>
    user.bookmarks.includes(course._id)
  );

  return (
    <PageWrapper>
      <SpacedTitle>Your List</SpacedTitle>
      {!bookmarks.length ? (
        <Typography sx={{ textAlign: 'center' }}>
          You currently have no saved courses.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {bookmarks.map((course) => (
            <CourseDisplay
              key={course._id}
              course={{ ...course, src: '/stratocaster-small.jpg' }}
            />
          ))}
        </Grid>
      )}
    </PageWrapper>
  );
}
