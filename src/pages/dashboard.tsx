import { FC, ReactElement, ReactNode } from 'react';

import { GetServerSideProps } from 'next';

import { Grid, Typography } from '@mui/material';

import { getAllCourses, getAllSeries } from '@/lib';

import {
  HeaderImage,
  PageWrapper,
  CourseDisplay,
  Slider,
} from '@/src/components';

import { Course, Series, User } from '@/src/utils/interfaces';

// TODO: make real, not fake data, also all videos need alts and aria labels
const comingSoonCourse: Course = {
  _id: '12345678910',
  videoId: '12345678910',
  title: 'The Supernatural',
  description: 'This is a description of The Supernatural',
  coursePath: 'the-supernatural',
  seriesPath: 'peter-green',
  creationDate: new Date(),
};

interface ServerSideProps {
  props: { courses: Course[]; series: Series[] };
}

export const getServerSideProps: GetServerSideProps =
  async (ctx): Promise<ServerSideProps> => {
    // TODO: authenticateUser here, pass to getAllCourses,
    // need better strategy for this
    // TODO: need getAllCourses if getAllSeries already here?

    // this actually presents a bit of a problem.
    // if all the JSON for courses is inside the series,
    // then it's dupicated in 2 places, meaning that it will need to be
    // uploaded/edited in 2 places.
    const courses: Course[] = await getAllCourses();
    const series: Series[] = await getAllSeries();
    return {
      props: { courses, series },
    };
  };

interface CategoryWrapperProps {
  category: string;
  children: ReactNode;
}

const CategoryWrapper: FC<CategoryWrapperProps> = ({
  category,
  children,
}): ReactElement => (
  <Grid
    container
    direction='column'
    gap={1}
    sx={{
      padding: '2rem 0',
      maxWidth: '90vw',
    }}
  >
    <Typography variant='h4'>{category}</Typography>
    <Grid item container justifyContent='flex-start' gap={2} wrap='nowrap'>
      {children}
    </Grid>
  </Grid>
);

interface ContinueWatchingProps {
  course: Course;
}

// TODO: make custom component for these? They will never be sliders
const ContinueWatching: FC<ContinueWatchingProps> = ({
  course,
}): ReactElement => (
  <CategoryWrapper category='Continue Watching'>
    <CourseDisplay course={{ ...course, src: '/stratocaster-small.jpg' }} />
  </CategoryWrapper>
);

interface ComingSoonProps {
  course: Course;
}

// TODO: same here, make custom component, will never be a slider
const ComingSoon: FC<ComingSoonProps> = ({ course }): ReactElement => (
  <CategoryWrapper category='Coming Soon'>
    <CourseDisplay
      course={{ ...comingSoonCourse, src: '/stratocaster-small.jpg' }}
    />
  </CategoryWrapper>
);

interface DashboardProps {
  user: User | null;
  courses: Course[];
  series: Series[];
}

export default function Dashboard({
  user,
  courses,
  series,
}: DashboardProps): ReactElement {
  const latestCourses = courses
      ?.sort((a, b) => (a.creationDate > b.creationDate ? -1 : 1))
      .slice(0, 5),
    lastWatched = courses.find((c) => c._id === user?.lastWatched) ?? null,
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
          <Slider title='Continue Watching' courses={[lastWatched]} />
        ) : null}
        {!!bookmarks.length ? (
          <Slider title='Your List' courses={bookmarks} />
        ) : null}
        <Slider title='Latest Releases' courses={latestCourses} />
        <ComingSoon course={comingSoonCourse} />
        {series.map(({ _id, title, courses }) => (
          <Slider key={_id} title={`${title} Series`} courses={courses} />
        ))}
      </PageWrapper>
    </Grid>
  );
}
