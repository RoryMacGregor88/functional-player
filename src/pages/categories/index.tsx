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
  Category,
  UpdateCtx,
  CourseServerProps,
} from '@/src/utils/interfaces';

import {
  CATEGORY_METADATA,
  COURSE_LEVEL_METADATA,
  DEFAULT_ERROR_MESSAGE,
} from '@/src/utils/constants';

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

export default function Categories({ user, updateCtx, courses, error }: Props) {
  const {
    push,
    query: { category: categoryParam },
  } = useRouter();

  const category: Category = String(categoryParam),
    categoryMetadata = [...CATEGORY_METADATA, ...COURSE_LEVEL_METADATA].find(
      ({ value }) => value === category
    );

  useEffect(() => {
    if (!!error || !categoryMetadata) {
      push('/dashboard');
      updateCtx({
        toastData: {
          message: error?.message ?? DEFAULT_ERROR_MESSAGE,
          severity: 'error',
        },
      });
    }
  }, [categoryMetadata, push, error, updateCtx]);

  if (!!error || !categoryMetadata) return <LoadMask />;

  const categorisedCourses = courses.filter(({ categories }) =>
      categories.includes(categoryMetadata.value)
    ),
    continueWatching = categorisedCourses.find(
      (course) => course._id === user?.lastWatched
    ),
    bookmarks = courses.filter(({ _id }) => user?.bookmarks.includes(_id));
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
            banner
          />
        ) : null}
        {!!bookmarks.length ? (
          <Slider title='From Your List' courses={bookmarks} />
        ) : null}
        <Slider title={categoryMetadata.label} courses={categorisedCourses} />
      </Grid>
    </PageWrapper>
  );
}
