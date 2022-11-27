import { FC, ReactElement, ReactNode } from 'react';

import { GetServerSideProps } from 'next';

import { Grid, Typography } from '@mui/material';

import { getAllCourses, getAllSeries } from '@/lib';

import {
  HeaderImage,
  PageWrapper,
  Slider,
} from '@/src/components';

import { Course, Series, User, CustomError } from '@/src/utils/interfaces';

// TODO: make real, not fake data, also all videos need alts and aria labels
const comingSoonCourse: Course = {
  _id: '12345678910',
  videoId: '12345678910',
  trailerId: '12345678910',
  title: 'The Supernatural',
  description: 'This is a description of The Supernatural',
  level: 'intermediate',
  coursePath: 'the-supernatural',
  seriesPath: 'peter-green',
  creationDate: new Date(),
};

interface ServerSideProps {
  props: { error: CustomError } | { courses: Course[]; series: Series[] };
}

export const getServerSideProps: GetServerSideProps =
  async (ctx): Promise<ServerSideProps> => {
    const token = ctx.req.cookies[process.env.SESSION_TOKEN_NAME];

    // TODO: need getAllCourses if getAllSeries already here?
    // this actually presents a bit of a problem.
    // if all the JSON for courses is inside the series,
    // then it's dupicated in 2 places, meaning that it will need to be
    // uploaded/edited in 2 places.

    const { courses, error } = await getAllCourses(token);

    // TODO: getAllSeries must be typed like getAllCourses
    const series: Series[] = await getAllSeries(token);
    return {
      props: !!error
        ? { error, courses: null, series: null }
        : { error: null, courses, series },
    };
  };

interface CategoryWrapperProps {
  category: string;
  children: ReactNode;
}
interface DashboardProps {
  user: User | null;
  courses: Course[] | null;
  series: Series[] | null;
  error: CustomError | null;
}

export default function Dashboard({
  user,
  courses,
  series,
  error
}: DashboardProps): ReactElement {

  if (error) {
    // TODO: use toast
    // TODO: handle getServerSideProps error, test this
  }

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
        {series.map(({ _id, title, courses }) => (
          <Slider key={_id} title={title} courses={courses} />
        ))}
      </PageWrapper>
    </Grid>
  );
}
