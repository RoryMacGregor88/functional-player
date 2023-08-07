import { v4 as uuid } from 'uuid';

import { connectToDatabase } from '@/lib';

import {
  COURSE_LEVEL_METADATA,
  CATEGORY_METADATA,
  ARTIST_METADATA,
} from '@/src/utils/constants';

const COLLECTION = 'courses';

const description =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const getLevel = () =>
  COURSE_LEVEL_METADATA[
    Math.floor(Math.random() * COURSE_LEVEL_METADATA.length)
  ];

const getCategories = (levelObj) => {
  const categories = [1, 2, 3].reduce((acc) => {
    const randomCategoryObj =
      CATEGORY_METADATA[Math.floor(Math.random() * CATEGORY_METADATA.length)];
    return [...acc, randomCategoryObj];
  }, []);

  return [...Array.from(new Set([...categories, levelObj]))];
};

const artists = ARTIST_METADATA.map(({ label }) => label);
const getArtist = () => artists[Math.floor(Math.random() * artists.length)];

const data = new Array(50).fill(undefined).map((_, i) => {
  const level = getLevel(),
    artist = getArtist();

  return {
    _id: uuid(),
    title: `${artist} ${i + 1}`,
    description,
    artist,
    creationDate: new Date().toISOString(),
    courseId: '828060656',
    trailerId: '828060656',
    level,
    categories: getCategories(level),
  };
});

export default async function uploadCourses() {
  const { db } = await connectToDatabase();

  /** delete everything */
  // await db.collection(COLLECTION).deleteMany({});
  // console.log('DELETED COURSES');

  /** populate db */
  // const courses = await db.collection(COLLECTION).insertMany(data);
  // console.log('UPLOADED COURSES: ', courses);
}
