import { handleForbidden, handleServerError } from "../error-handlers";

const getAllCourses = () => {};
const getAllSeries = () => {};
const logServerError = () => {};

// TODO: delete this, mocked in tests

// const connectToDatabase = () => {
//   const collection = () => {
//     console.log("HIT COLLECTION");
//     return { findOne: () => console.log("HIT FINDONE") };
//   };
//   return { db: { collection } };
// };

const syncStripeAndDb = (db, email) => {
  console.log("DB: ", db);
  console.log("EMAIL: ", email);
};

export {
  getAllCourses,
  getAllSeries,
  logServerError,
  // connectToDatabase,
  syncStripeAndDb,
  handleForbidden,
  handleServerError,
};
