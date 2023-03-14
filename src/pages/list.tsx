import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { withIronSessionSsr } from 'iron-session/next';

import { GetServerSideProps } from 'next';

import { Typography } from '@mui/material';

import { PageWrapper, LoadMask, Slider } from '@/src/components';

import { LOGIN_REQUIRED_MESSAGE } from '@/src/utils/constants';

import {
  Course,
  User,
  Ctx,
  UpdateCtx,
  CustomError,
  CourseServerProps,
} from '@/src/utils/interfaces';

import { getCourses, sessionOptions } from '@/lib';

interface ServerSideProps {
  props: CourseServerProps;
}

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async ({ req }): Promise<ServerSideProps> => {
    const user = req.session.user;
    const props = await getCourses(user);
    return { props };
  },
  sessionOptions
);

interface Props {
  user: User;
  ctx: Ctx;
  updateCtx: UpdateCtx;
  courses: Course[] | null;
  error: CustomError | null;
}

export default function List({
  user,
  ctx,
  updateCtx,
  courses,
  error,
}: Props): ReactElement {
  const { push } = useRouter();

  useEffect(() => {
    if (!user) {
      push('/login');

      // this is here because we need to conditionally call updateCtx here,
      // as the toast message here will override the toast message from
      // logging out if the user logs out from this page
      if (!ctx.toastData) {
        updateCtx({
          toastData: {
            severity: 'error',
            message: LOGIN_REQUIRED_MESSAGE,
          },
        });
      }
    } else if (!!error) {
      const { message } = error;
      updateCtx({
        toastData: {
          message,
          severity: 'error',
        },
      });
      // TODO: used to be above updateCtx, make sure still works
      push('/dashboard');
    }
  }, [user, push, error, updateCtx, ctx]);

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
