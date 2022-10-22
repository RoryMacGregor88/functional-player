import { connectToDatabase } from "lib";
import { v4 as uuidv4 } from "uuid";

const COLLECTION = "series-2";

const data = {
  _id: uuidv4(),
  creationDate: "200522",
  seriesPath: "john-mayer",
  title: "John Mayer",
  description: "This is our John Mayer series",
  courses: [
    {
      _id: uuidv4(),
      seriesPath: "john-mayer",
      coursePath: "neon",
      videoId: "579544403",
      title: "Neon",
      description: "This is a description of Neon",
      viewCount: Math.floor(Math.random() * 1000),
      creationDate: "200522",
    },
    {
      _id: uuidv4(),
      seriesPath: "john-mayer",
      coursePath: "slow-dancing-in-a-burning-room",
      videoId: "579544403",
      title: "Slow Dancing In A Burning Room",
      description: "This is a description of Slow Dancing In A Burning Room",
      viewCount: Math.floor(Math.random() * 1000),
      creationDate: "200813",
    },
    {
      _id: uuidv4(),
      seriesPath: "john-mayer",
      coursePath: "til-the-right-one-comes",
      videoId: "579544403",
      title: "Til The Right One Comes",
      description: "This is a description of Til The Right One Comes",
      viewCount: Math.floor(Math.random() * 1000),
      creationDate: "210324",
    },
  ],
};

export const uploadSeries = async () => {
  const { db } = await connectToDatabase();

  const series = await db
    .collection(COLLECTION)
    .insertOne(data)
    .then(({ ops }) => ops[0]);

  console.log("UPLOADED SERIES: ", series);
};
