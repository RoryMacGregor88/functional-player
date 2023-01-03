import { connectToDatabase } from '@/lib';

import { DEFAULT_ERROR_MESSAGE, COURSES } from '@/src/utils/constants';

import { Course, CustomError, User, DbCourse } from '@/src/utils/interfaces';

export default async function getCourses(
  user: User,
  find: object = {}
): Promise<{ courses: Course[] | null; error: CustomError | null }> {
  try {
    const { db } = await connectToDatabase();
    // find property is only used in test to force error state
    const dbCourses = await db
      .collection<DbCourse>(COURSES)
      .find(find)
      .toArray();

    const isAuthorized = user?.subscriptionStatus === 'active',
      courses: Course[] = dbCourses.map(({ courseId, trailerId, ...rest }) => ({
        videoId: isAuthorized ? courseId : trailerId,
        ...rest,
      }));

    console.log(isAuthorized ? 'AUTHORIZED' : 'RESTRICTED');
    return { error: null, courses };
  } catch (e) {
    console.log('ERROR in getCourses: ', e);
    const error = { message: DEFAULT_ERROR_MESSAGE };
    return { error, courses: null };
  }
}
