import { connectToDatabase } from "lib/mongodb";
import { SERIES } from "@/src/utils";

const getAllCourses = async () => {
  const { db } = await connectToDatabase();
  const series = await db.collection(SERIES).find({}).toArray();

  const courses = series.reduce((acc, cur) => {
    return [...acc, ...cur.courses];
  }, []);

  return courses;
};

const getCourseById = async (seriesPath, coursePath) => {
  const { db } = await connectToDatabase();
  const series = await db.collection(SERIES).find({ seriesPath }).toArray();

  const course = series?.[0].courses?.find((c) => c.coursePath === coursePath);
  return course;
};

export { getAllCourses, getCourseById };
