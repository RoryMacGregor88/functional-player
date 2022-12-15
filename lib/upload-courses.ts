import { connectToDatabase } from '@/lib';

import { v4 as uuidv4 } from 'uuid';

import {
  COURSE_LEVEL_METADATA,
  CATEGORY_METADATA,
  ARTIST_METADATA,
} from '@/src/utils/constants';

const COLLECTION = 'courses';

const description =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const levelRatings = COURSE_LEVEL_METADATA.map(({ value }) => value);
const getLevel = () =>
  levelRatings[Math.floor(Math.random() * levelRatings.length)];

const categories = CATEGORY_METADATA.map(({ value }) => value);
const getCategories = (level) => {
  let result = [];
  for (let i = 0; i <= 3; i++) {
    result = [
      ...result,
      categories[Math.floor(Math.random() * categories.length)],
    ];
  }
  return [...Array.from(new Set([...result, level]))];
};

const artists = ARTIST_METADATA.map(({ label }) => label);
const getArtist = () => artists[Math.floor(Math.random() * artists.length)];

const data = new Array(50).fill(undefined).map((_, i) => {
  const level = getLevel(),
    artist = getArtist();

  //TODO: make artist a label/value object, and any others that require it. Needed for url params

  return {
    _id: uuidv4(),
    title: `${artist} ${i + 1}`,
    description,
    artist,
    creationDate: new Date().toISOString(),
    courseId: '579544403',
    trailerId: '579544403',
    level,
    categories: getCategories(level),
  };
});

export const uploadCourses = async () => {
  const { db } = await connectToDatabase();
  const courses = await db.collection(COLLECTION).insertMany(data);
  console.log('UPLOADED COURSES: ', courses);
};
