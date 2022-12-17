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
    const data = await db.collection(COURSES).find(find).toArray();

    const isAuthorized = user?.subscriptionStatus === 'active';
    const courses: Course[] = data.map(({ courseId, trailerId, ...rest }) => ({
      videoId: isAuthorized ? courseId : trailerId,
      ...rest,
    }));

    console.log(isAuthorized ? 'AUTHORIZED' : 'RESTRICTED');

    return { error: null, courses };
  } catch (e) {
    console.log('ERROR in getAllCourses: ', e);
    const error = { message: DEFAULT_ERROR_MESSAGE };
    return { error, courses: null };
  }
}
