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
  CourseServerProps,
  Category,
  UpdateCtx,
} from '@/src/utils/interfaces';

import { CATEGORY_METADATA } from '@/src/utils/constants';

const comingSoonCourse: Course = {
  _id: '12345678910',
  videoId: '12345678910',
  title: 'Peter Green Coming Soon',
  description: 'This is a description of Peter Green Coming Soon',
  artist: 'Peter Green',
  level: { label: 'Intermediate', value: 'intermediate', color: 'info.dark' },
  creationDate: new Date().toISOString(),
  categories: [],
};

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
    if (error) {
      const { message } = error;
      updateCtx({
        toastData: {
          message,
          severity: 'error',
        },
      });
    }
  }, [push, error, updateCtx, user]);

  if (error) return <LoadMask />;

  const getCategoryCourses = (category: Category): Course[] =>
    courses.filter(({ categories }) =>
      categories.map(({ value }) => value).includes(category.value)
    );

  const latestCourses = courses
      .sort((a, b) => (a.creationDate > b.creationDate ? -1 : 1))
      .slice(0, 5),
    lastWatched = courses.find(({ _id }) => _id === user?.lastWatched),
    bookmarks = courses.filter(({ _id }) => !!user?.bookmarks.includes(_id));
  return (
    <Grid container direction='column'>
      <HeaderImage src='landing' alt='landing-page' />
      <PageWrapper>
        {!!lastWatched ? (
          <Slider title='Continue Watching' courses={[lastWatched]} banner />
        ) : null}
        {!!bookmarks.length ? (
          <Slider title='Your List' courses={bookmarks} />
        ) : null}
        <Slider title='Recently Added' courses={latestCourses} />
        <Slider title='Coming Soon' courses={[comingSoonCourse]} banner />
        {CATEGORY_METADATA.map((category) => {
          const { label, value } = category;
          return (
            <Slider
              key={value}
              title={label}
              courses={getCategoryCourses(category)}
            />
          );
        })}
      </PageWrapper>
    </Grid>
  );
}
