import { ReactElement } from 'react';

import { GetServerSideProps } from 'next';

import { Grid } from '@mui/material';

import { getAllCourses } from '@/lib';

import {
  HeaderImage,
  PageWrapper,
  Slider,
} from '@/src/components';

import { Course, User, CustomError, Category } from '@/src/utils/interfaces';

import { CATEGORY_METADATA } from '@/src/utils/constants'

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

export const getServerSideProps: GetServerSideProps =
  async (ctx): Promise<ServerSideProps> => {
    const token = ctx.req.cookies[process.env.SESSION_TOKEN_NAME];

    const { courses, error } = await getAllCourses(token);

    return {
      props: !!error
        ? { error, courses: null }
        : { error: null, courses },
    };
  };
interface DashboardProps {
  user: User | null;
  courses: Course[] | null;
  error: CustomError | null;
}

export default function Dashboard({
  user,
  courses,
  error
}: DashboardProps): ReactElement {

  if (error) {
    // TODO: use toast
    // TODO: handle getServerSideProps error, test this
  }

  const getCategoryCourses = (value: Category): Course[] =>
    courses.filter(({ categories }) => {
      return categories.includes(value)
    });

  const latestCourses = courses
      ?.sort((a, b) => (a.creationDate > b.creationDate ? -1 : 1))
      .slice(0, 5),
    lastWatched = courses.find(({ _id }) => _id === user?.lastWatched) ?? null,
    bookmarks = courses.filter(({ _id }) => user?.bookmarks.includes(_id));
  return (
    <Grid container direction='column' sx={{ width: '100%' }}>
      <HeaderImage
        src='/stratocaster'
        alt='stratocaster'
        title='Stratocaster Image'
      />
      <PageWrapper>
        {!!lastWatched ? (
          <Slider title='Continue Watching' courses={[lastWatched]} banner={true} />
        ) : null}
        {!!bookmarks.length ? (
          <Slider title='Your List' courses={bookmarks} />
        ) : null}
        <Slider title='Latest Releases' courses={latestCourses} />
        <Slider title='Coming Soon' courses={[comingSoonCourse]} banner={true} />
        {CATEGORY_METADATA.map(({ label, value }) => (
          <Slider key={value} title={label} courses={getCategoryCourses(value)} />
        ))}
      </PageWrapper>
    </Grid>
  );
}
