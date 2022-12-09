import { GetServerSideProps } from 'next';

import { useRouter } from 'next/router';

import { Grid } from '@mui/material';

import { getAllCourses } from '@/lib';

import { PageWrapper, Slider, LoadMask } from '@/src/components';

import {
  User,
  UpdateCtx,
  Course,
  CustomError,
  Artist,
} from '@/src/utils/interfaces';

import { ARTIST_METADATA } from '@/src/utils/constants';

interface ServerSideProps {
  props: { error: CustomError } | { courses: Course[] };
}

export const getServerSideProps: GetServerSideProps = async (
  ctx
): Promise<ServerSideProps> => {
  const token = ctx.req.cookies[process.env.SESSION_TOKEN_NAME];

  const { error, courses } = await getAllCourses(token);
  return {
    props: !!error ? { error, courses: null } : { error: null, courses },
  };
};

interface Props {
  user: User | null;
  updateCtx: UpdateCtx;
  courses: Course[];
}

// TODO: does not reset slider when changing categories
// TODO: does not reset select when changing categories
// TODO: bottom margin is disappearing behind footer

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
