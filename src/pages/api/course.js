import { connectToDatabase } from "lib/mongodb";
import { SERIES } from "src/constants";

// TODO: should all fo these br utils somewhere? They are all endpoints if in this directory.

export const getAllCourses = async () => {
  const { db } = await connectToDatabase();
  const series = await db.collection(SERIES).find({}).toArray();

  const courses = series?.reduce((acc, cur) => {
    return [...acc, ...cur.courses];
  }, []);

  return courses;
};

export const getCourseById = async (seriesPath, coursePath) => {
  const { db } = await connectToDatabase();
  const series = await db.collection(SERIES).find({ seriesPath }).toArray();

  const course = series?.[0].courses?.find((c) => c.coursePath === coursePath);
  return course;
};
