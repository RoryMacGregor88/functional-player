import { connectToDatabase } from '@/lib';

import { DEFAULT_ERROR_MESSAGE, COURSES } from '@/src/utils/constants';

import { Course, CustomError, User } from '@/src/utils/interfaces';

export default async function getCourses(
  user: User,
  find: object = {}
): Promise<{ courses: Course[] | null; error: CustomError | null }> {
  try {
    const { db } = await connectToDatabase();
    // find property is only used in test to force error state
    const dbCourses = await db.collection(COURSES).find(find).toArray();

    const isAuthorized = user?.subscriptionStatus === 'active',
      courses: Course[] = dbCourses.map((dbCourse) => {
        const {
          _id,
          courseId,
          trailerId,
          title,
          description,
          artist,
          creationDate,
          level,
          categories,
        } = dbCourse;

        return {
          videoId: isAuthorized ? courseId : trailerId,
          _id,
          title,
          description,
          artist,
          creationDate,
          level,
          categories,
        };
      });

    console.log(isAuthorized ? 'AUTHORIZED' : 'RESTRICTED');
    return { error: null, courses };
  } catch (e) {
    console.log('ERROR in getCourses: ', e);
    const error = { message: DEFAULT_ERROR_MESSAGE };
    return { error, courses: null };
  }
}
