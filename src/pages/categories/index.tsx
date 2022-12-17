import { GetServerSideProps } from 'next';

import { useRouter } from 'next/router';

import { withIronSessionSsr } from 'iron-session/next';

import { Grid } from '@mui/material';

import { getCourses, sessionOptions } from '@/lib';

import { PageWrapper, Slider, LoadMask } from '@/src/components';

import { User, Course, CustomError, Category } from '@/src/utils/interfaces';

import {
  CATEGORY_METADATA,
  COURSE_LEVEL_METADATA,
} from '@/src/utils/constants';

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
    query: { category: categoryParam },
  } = useRouter();

  const category: Category = `${categoryParam}`,
    categoryMetadata = [...CATEGORY_METADATA, ...COURSE_LEVEL_METADATA].find(
      ({ value }) => value === category
    );

  if (!categoryMetadata) {
    push('/dashboard');
    return <LoadMask />;
  }

  const categorisedCourses = courses.filter(({ categories }) =>
      categories.includes(categoryMetadata.value)
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
        sx={{ marginTop: '4.5rem' }}
      >
        {continueWatching ? (
          <Slider
            title='Continue Watching'
            courses={[continueWatching]}
            banner={true}
          />
        ) : null}
        <Slider title={categoryMetadata.label} courses={categorisedCourses} />
      </Grid>
    </PageWrapper>
  );
}
