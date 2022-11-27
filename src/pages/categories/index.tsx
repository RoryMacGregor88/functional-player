import { GetServerSideProps } from 'next';

import { useRouter } from 'next/router';

import { Grid } from '@mui/material';

import { getAllCourses } from '@/lib';

import { PageWrapper, Slider, LoadMask } from '@/src/components';

import { User, UpdateCtx, Course, CustomError } from '@/src/utils/interfaces';

import { CATEGORY_SELECT_OPTIONS } from '@/src/utils/constants';

interface ServerSideProps {
  props: { error: CustomError } | { courses: Course[] };
}

export const getServerSideProps: GetServerSideProps =
  async (ctx): Promise<ServerSideProps> => {
  const token = ctx.req.cookies[process.env.SESSION_TOKEN_NAME];

  const { error, courses } = await getAllCourses(token);
  return {
    props: !!error
      ? { error, courses: null }
      : { error: null, courses },
  };
};

interface Props {
  user: User;
  updateCtx: UpdateCtx;
  courses: Course[];
}

// TODO: does not reset slider when changing categories
// TODO: bottom margin is disappearing behind footer

export default function Categories({ user, courses }: Props) {
  const { push, query: { category } } = useRouter();

  // TODO: make this real categorisation filter
  const categorisedCourses = courses;

  const categoryLabel =
    CATEGORY_SELECT_OPTIONS.find(({ value }) => value === category)?.label;

    const continueWatching = categorisedCourses.find(course => course._id === user?.lastWatched)

  if (!categoryLabel) {
    push('/dashboard');
    return <LoadMask />
  }

  return (
    <PageWrapper>
      <Grid container direction='column' justifyContent='center' sx={{ height: '100%', marginTop: '4.5rem' }}>
        {continueWatching ? (
          <Slider title='Continue Watching' courses={[continueWatching]} banner={true} />
        ) : null}
        <Slider title={categoryLabel} courses={courses} />
      </Grid>
    </PageWrapper>
  )
}
