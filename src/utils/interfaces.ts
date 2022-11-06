//TODO: check type of customerId and _id
//TODO: should password be included?

export type id = string | number;

export interface User {
  _id: id;
  email: string;
  username: string;
  subscriptionId: id;
  customerId: id;
  subscriptionStatus: string;
  bookmarks: id[];
  lastWatched: id;
}

export interface Course {
  _id: id;
  videoId: id;
  title: string;
  description: string;
  coursePath: string;
  seriesPath: string;
  creationDate: Date;
}

export interface Series {
  _id: id;
  title: string;
  description: string;
  seriesPath: string;
  courses: Course[];
  creationDate: Date;
}

export interface Video {}
