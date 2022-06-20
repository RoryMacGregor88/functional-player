import { connectToDatabase } from "lib/mongodb";
import { SERIES } from "@/src/utils";

const getAllSeries = async () => {
  const { db } = await connectToDatabase();
  const series = await db.collection(SERIES).find({}).toArray();
  return series;
};

const getSeriesById = async (seriesPath) => {
  const { db } = await connectToDatabase();
  const series = await db.collection(SERIES).find({ seriesPath }).toArray();
  return series?.[0];
};

export { getAllSeries, getSeriesById };
