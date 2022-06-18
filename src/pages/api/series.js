import { connectToDatabase } from "lib/mongodb";
import { SERIES } from "@/src/utils";

export const getAllSeries = async () => {
  const { db } = await connectToDatabase();
  const series = await db.collection(SERIES).find({}).toArray();
  return series;
};

export const getSeriesById = async (seriesPath) => {
  const { db } = await connectToDatabase();
  const series = await db.collection(SERIES).find({ seriesPath }).toArray();
  return series?.[0];
};
