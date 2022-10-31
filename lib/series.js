import { connectToDatabase } from "@/lib";
import { SERIES } from "@/src/utils";

const getAllSeries = async () => {
  try {
    const { db } = await connectToDatabase();
    const series = await db.collection(SERIES).find({}).toArray();
    return series;
  } catch (error) {
    console.log("ERROR in getAllSeries: ", error);
    // TODO: handle error some other way, no res object
  }
};

const getSeriesById = async (seriesPath) => {
  try {
    const { db } = await connectToDatabase();
    const series = await db.collection(SERIES).find({ seriesPath }).toArray();
    return series?.[0];
  } catch (error) {
    console.log("ERROR in getSeriesById: ", error);
    // TODO: handle error some other way, no res object
  }
};

export { getAllSeries, getSeriesById };
