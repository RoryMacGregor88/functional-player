import { useEffect } from 'react';

import { GetServerSideProps } from 'next';

import { useRouter } from 'next/router';

import { withIronSessionSsr } from 'iron-session/next';

import { Grid } from '@mui/material';

import { getCourses, sessionOptions } from '@/lib';

import { PageWrapper, Slider, LoadMask } from '@/src/components';

import {
  User,
  Course,
  CustomError,
  CourseServerProps,
  Artist,
  UpdateCtx,
} from '@/src/utils/interfaces';

import { ARTIST_METADATA, DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

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
  updateCtx: UpdateCtx;
  courses: Course[] | null;
  error: CustomError | null;
}

export default function Artists({ user, updateCtx, courses, error }: Props) {
  const {
    push,
    query: { artist: artistParam },
  } = useRouter();

  const artist: Artist = String(artistParam),
    artistLabel = ARTIST_METADATA.find(({ value }) => value === artist)?.label;

  useEffect(() => {
    if (!!error || !artistLabel) {
      push('/dashboard');
      updateCtx({
        toastData: {
          message: error?.message ?? DEFAULT_ERROR_MESSAGE,
          severity: 'error',
        },
      });
    }
  }, [artistLabel, push, error, updateCtx]);

  if (!!error || !artistLabel) return <LoadMask />;

  const categorisedCourses = courses.filter(
      ({ artist }) => artist === artistLabel
    ),
    lastWatched = categorisedCourses.find(
      (course) => course._id === user?.lastWatched
    ),
    bookmarks = courses.filter(({ _id }) => user?.bookmarks.includes(_id));
  return (
    <PageWrapper>
      <Grid
        container
        direction='column'
        justifyContent='center'
        sx={{ height: '100%', marginTop: '4.5rem' }}
      >
        {!!lastWatched ? (
          <Slider title='Continue Watching' courses={[lastWatched]} banner />
        ) : null}
        {!!bookmarks.length ? (
          <Slider title='From Your List' courses={bookmarks} />
        ) : null}
        <Slider title={artistLabel} courses={categorisedCourses} />
      </Grid>
    </PageWrapper>
  );
}
