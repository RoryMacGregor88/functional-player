import { GetServerSideProps } from 'next';

import { useRouter } from 'next/router';

import { withIronSessionSsr } from 'iron-session/next';

import { Grid } from '@mui/material';

import { getCourses, sessionOptions } from '@/lib';

import { PageWrapper, Slider, LoadMask } from '@/src/components';

import { User, Course, CustomError, Artist } from '@/src/utils/interfaces';

import { ARTIST_METADATA } from '@/src/utils/constants';

interface ServerSideProps {
  props: { error: CustomError } | { courses: Course[] };
}

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async ({ req }): Promise<ServerSideProps> => {
    const user = req.session.user;
    const { error, courses } = await getCourses(user);
    return {
      props: !!error ? { error, courses: null } : { error: null, courses },
    };
  },
  sessionOptions
);

interface Props {
  user: User;
  courses: Course[];
}

// TODO: does not reset slider when changing categories
// does not reset select when changing categories
// bottom margin is disappearing behind footer (pretty sure this is fixed?)

// Why was updateCtx here? Is it needed

// needs tests

export default function Categories({ user, courses }: Props) {
  const {
    push,
    query: { artist: artistParam },
  } = useRouter();

  const artist: Artist = `${artistParam}`,
    artistLabel = ARTIST_METADATA.find(({ value }) => value === artist)?.label;

  if (!artistLabel) {
    push('/dashboard');
    return <LoadMask />;
  }

  const categorisedCourses = courses.filter(
      ({ artist }) => artist === artistLabel
    ),
    continueWatching = categorisedCourses.find(
      (course) => course._id === user?.lastWatched
    );

  return (
    <PageWrapper>
      <Grid
        container
        direction='column'
        justifyContent='center'
        sx={{ height: '100%', marginTop: '4.5rem' }}
      >
        {continueWatching ? (
          <Slider
            title='Continue Watching'
            courses={[continueWatching]}
            banner={true}
          />
        ) : null}
        <Slider title={artistLabel} courses={categorisedCourses} />
      </Grid>
    </PageWrapper>
  );
}
