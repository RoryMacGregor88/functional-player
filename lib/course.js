import { connectToDatabase } from '@/lib';
import { SERIES } from '@/src/utils/constants';

const getAllCourses = async () => {
  try {
    const { db } = await connectToDatabase();
    const series = await db.collection(SERIES).find({}).toArray();

    const courses = series.reduce((acc, cur) => {
      return [...acc, ...cur.courses];
    }, []);

    return courses;
  } catch (error) {
    console.log('ERROR in getAllCourses: ', error);
    // TODO: handle error some other way, no res object
  }
};

const getCourseById = async (seriesPath, coursePath) => {
  try {
    const { db } = await connectToDatabase();
    const series = await db.collection(SERIES).find({ seriesPath }).toArray();

    const course = series?.[0].courses?.find(
      (c) => c.coursePath === coursePath
    );
    return course;
  } catch (error) {
    console.log('ERROR in getCourseById: ', error);
    // TODO: handle error some other way, no res object
  }
};

export { getAllCourses, getCourseById };
