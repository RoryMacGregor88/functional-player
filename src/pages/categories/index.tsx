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
  Category,
} from '@/src/utils/interfaces';

import {
  CATEGORY_METADATA,
  COURSE_LEVEL_METADATA,
} from '@/src/utils/constants';

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
  user: User;
  updateCtx: UpdateCtx;
  courses: Course[];
}

// TODO: does not reset slider when changing categories
// TODO: does not reset select when changing categories
// TODO: bottom margin is disappearing behind footer

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
