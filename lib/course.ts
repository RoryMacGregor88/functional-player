import { connectToDatabase } from '@/lib';

import { DEFAULT_ERROR_MESSAGE, SERIES } from '@/src/utils/constants';

import { Series, Course, CustomError, Token } from '@/src/utils/interfaces';

const getAllCourses = async (token: Token) : Promise<{ courses: Course[] | null, error: CustomError | null }> => {
  try {
    const { db } = await connectToDatabase();
    const series: Series[] = await db.collection(SERIES).find({}).toArray();

    const courses: Course[] = series.reduce((acc, cur) => {
      const courses = cur.courses.map(({ videoId, trailerId,  ...rest }) =>
       !!token ? { videoId, ...rest } : { trailerId, ...rest });
      return [...acc, ...courses];
    }, []);

    return { error: null, courses };
  } catch (e) {
    console.log('ERROR in getAllCourses: ', e);
    const error = { message: DEFAULT_ERROR_MESSAGE };
    return { error, courses: null };
  }
};

const getCourseById = async (seriesPath: string, coursePath: string): Promise<{ course: Course[] | null, error: CustomError | null }> => {
  try {
    const { db } = await connectToDatabase();
    const series = await db.collection(SERIES).find({ seriesPath }).toArray();

    const course = series?.[0].courses?.find(
      (c) => c.coursePath === coursePath
    );
    return { error: null, course };
  } catch (e) {
    console.log('ERROR in getCourseById: ', e);
    const error = { message: DEFAULT_ERROR_MESSAGE };
    return { error, course: null };
  }
};

export { getAllCourses, getCourseById };
