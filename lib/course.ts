import { connectToDatabase } from '@/lib';

import { DEFAULT_ERROR_MESSAGE, COURSES } from '@/src/utils/constants';

import { Course, CustomError, Token } from '@/src/utils/interfaces';

const getAllCourses = async (token: Token) : Promise<{ courses: Course[] | null, error: CustomError | null }> => {
  try {
    const { db } = await connectToDatabase();
    const data = await db.collection(COURSES).find({}).toArray();

    // TODO: real iron-session authentication, not just truthiness
    const isAuthorized = !!token;

    const courses: Course[] = data.map(({ courseId, trailerId, ...rest }) => ({
      videoId: isAuthorized ? courseId : trailerId,
      ...rest
    }));

    return { error: null, courses };
  } catch (e) {
    console.log('ERROR in getAllCourses: ', e);
    const error = { message: DEFAULT_ERROR_MESSAGE };
    return { error, courses: null };
  }
};

export { getAllCourses };
