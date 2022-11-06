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
}

export interface Course {}

export interface Series {}

export interface Video {}
