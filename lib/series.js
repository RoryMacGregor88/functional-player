import { connectToDatabase } from "./mongodb";
import { SERIES } from "@/src/utils";

const getAllSeries = async () => {
  try {
    const { db } = await connectToDatabase();
    const series = await db.collection(SERIES).find({}).toArray();
    return series;
  } catch (error) {
    console.log("ERROR in getAllSeries: ", error);
    return res.status(500).send({ error });
  }
};

const getSeriesById = async (seriesPath) => {
  try {
    const { db } = await connectToDatabase();
    const series = await db.collection(SERIES).find({ seriesPath }).toArray();
    return series?.[0];
  } catch (error) {
    console.log("ERROR in getSeriesById: ", error);
    return res.status(500).send({ error });
  }
};

export { getAllSeries, getSeriesById };
