import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import { withIronSessionSsr } from 'iron-session/next';

import { GetServerSideProps } from 'next';

import { Grid, Typography } from '@mui/material';

import {
  PageWrapper,
  SpacedTitle,
  CourseDisplay,
  LoadMask,
} from '@/src/components';

import { Course, User, CustomError } from '@/src/utils/interfaces';

import { getCourses, sessionOptions } from '@/lib';

interface ServerSideProps {
  props: { error: CustomError } | { courses: Course[] };
}

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }): Promise<ServerSideProps> {
    const user = req.session.user;
    const { courses, error } = await getCourses(user);
    return {
      props: !!error ? { error, courses: null } : { error: null, courses },
    };
  },
  sessionOptions
);

interface Props {
  user: User;
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
