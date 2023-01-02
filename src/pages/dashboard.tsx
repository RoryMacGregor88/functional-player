import { ReactElement, useEffect } from 'react';

import { withIronSessionSsr } from 'iron-session/next';

import { GetServerSideProps } from 'next';

import { useRouter } from 'next/router';

import { Grid } from '@mui/material';

import { getCourses, sessionOptions } from '@/lib';

import { HeaderImage, PageWrapper, Slider, LoadMask } from '@/src/components';

import {
  Course,
  User,
  CustomError,
  Category,
  UpdateCtx,
} from '@/src/utils/interfaces';

import { CATEGORY_METADATA } from '@/src/utils/constants';

// TODO: make real, not fake data, also all videos need alts and aria labels
const comingSoonCourse: Course = {
  _id: '12345678910',
  videoId: '12345678910',
  title: 'Peter Green Coming Soon',
  description: 'This is a description of Peter Green Coming Soon',
  artist: 'Peter Green',
  level: 'intermediate',
  creationDate: new Date().toISOString(),
  categories: [],
};

interface ServerSideProps {
  props: { error: CustomError } | { courses: Course[] };
}

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async ({ req }): Promise<ServerSideProps> => {
    const user = req.session.user;
    const { courses, error } = await getCourses(user);
    return {
      props: !!error ? { error, courses: null } : { error: null, courses },
    };
  },
  sessionOptions
);
interface DashboardProps {
  user: User;
  updateCtx: UpdateCtx;
  courses: Course[] | null;
  error: CustomError | null;
}

export default function Dashboard({
  user,
  updateCtx,
  courses,
  error,
}: DashboardProps): ReactElement {
  const { push } = useRouter();

  useEffect(() => {
    if (!!error) {
      updateCtx({
        toastData: {
          message: error.message,
          severity: 'error',
        },
      });
      push('/dashboard');
    }
  }, [push, error, updateCtx]);

  if (!!error) return <LoadMask />;

  const getCategoryCourses = (category: Category): Course[] =>
    courses.filter(({ categories }) => categories.includes(category));

  const latestCourses = courses
      ?.sort((a, b) => (a.creationDate > b.creationDate ? -1 : 1))
      .slice(0, 5),
    lastWatched = courses.find(({ _id }) => _id === user?.lastWatched),
    bookmarks = courses.filter(({ _id }) => user?.bookmarks.includes(_id));
  return (
    <Grid container direction='column'>
      <HeaderImage
        src='/stratocaster'
        alt='stratocaster'
        title='Stratocaster Image'
      />
      <PageWrapper>
        {!!lastWatched ? (
          <Slider
            title='Continue Watching'
            courses={[lastWatched]}
            banner={true}
          />
        ) : null}
        {!!bookmarks.length ? (
          <Slider title='Your List' courses={bookmarks} />
        ) : null}
        <Slider title='Recently Added' courses={latestCourses} />
        <Slider
          title='Coming Soon'
          courses={[comingSoonCourse]}
          banner={true}
        />
        {CATEGORY_METADATA.map(({ label, value }) => {
          const test = getCategoryCourses(value);
          console.log('test: ', test);
          return <Slider key={value} title={label} courses={test} />;
        })}
      </PageWrapper>
    </Grid>
  );
}
