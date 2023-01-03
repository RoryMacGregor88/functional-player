import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { withIronSessionSsr } from 'iron-session/next';

import { GetServerSideProps } from 'next';

import { Grid, Typography } from '@mui/material';

import { PageWrapper, SpacedTitle, LoadMask } from '@/src/components';

import {
  Course,
  User,
  CustomError,
  CourseServerProps,
} from '@/src/utils/interfaces';

import { getCourses, sessionOptions } from '@/lib';

interface ServerSideProps {
  props: CourseServerProps;
}

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }): Promise<ServerSideProps> {
    const user = req.session.user;
    const props = await getCourses(user);
    return { props };
  },
  sessionOptions
);

interface Props {
  user: User;
  courses: Course[] | null;
  error: CustomError | null;
}

export default function List({ user, courses, error }: Props): ReactElement {
  const { push } = useRouter();

  // TODO: show 'You must be logged in' message instead of redirecting
  // deal with error
  useEffect(() => {
    if (!user) push('/login');
  }, [user, push]);

  if (!user) return <LoadMask />;

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
          <h1>FIX THIS!!!</h1>
        </Grid>
      )}
    </PageWrapper>
  );
}
