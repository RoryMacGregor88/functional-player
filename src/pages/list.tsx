import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { withIronSessionSsr } from 'iron-session/next';

import { GetServerSideProps } from 'next';

import { Typography } from '@mui/material';

import { PageWrapper, LoadMask, Slider } from '@/src/components';

import {
  Course,
  User,
  UpdateCtx,
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
  updateCtx: UpdateCtx;
  courses: Course[] | null;
  error: CustomError | null;
}

export default function List({
  user,
  updateCtx,
  courses,
  error,
}: Props): ReactElement {
  const { push } = useRouter();

  useEffect(() => {
    if (!user) push('/login');
    if (!!error) {
      updateCtx({
        toastData: {
          message: error.message,
          severity: 'error',
        },
      });
    }
  }, [user, push, error, updateCtx]);

  if (!user || !!error) return <LoadMask />;

  const bookmarks = courses.filter((course) =>
    user.bookmarks.includes(course._id)
  );

  return (
    <PageWrapper>
      {!bookmarks.length ? (
        <Typography sx={{ textAlign: 'center' }}>
          You currently have no saved courses.
        </Typography>
      ) : (
        <Slider title='Your List' courses={bookmarks} />
      )}
    </PageWrapper>
  );
}
