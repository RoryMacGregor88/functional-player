import { connectToDatabase } from "./mongodb";
import { SERIES } from "@/src/utils";

const getAllCourses = async () => {
  try {
    const { db } = await connectToDatabase();
    const series = await db.collection(SERIES).find({}).toArray();

    const courses = series.reduce((acc, cur) => {
      return [...acc, ...cur.courses];
    }, []);

    return courses;
  } catch (error) {
    console.log("ERROR in getAllCourses: ", error);
    return res.status(500).send({ error });
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
    console.log("ERROR in getCourseById: ", error);
    return res.status(500).send({ error });
  }
};

export { getAllCourses, getCourseById };
