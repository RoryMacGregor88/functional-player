//TODO: check type of customerId

export interface User {
  email: string;
  username: string;
  password: string;
  subscriptionId: string;
  customerId: string | number;
  subscriptionStatus: string;
  bookmarks: string[];
}
