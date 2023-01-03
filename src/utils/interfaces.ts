import { Stripe } from '@stripe/stripe-js';

import { ObjectId } from 'mongodb';

import { StripeElements } from '@stripe/stripe-js';

import { AlertColor } from '@mui/material';

type StripeModules = {
  stripe: Stripe;
  elements: StripeElements;
};

export type Id = string | number | ObjectId;
export type Token = string;
export type Category = string;
export type Artist = string;
export type DateString = string;
export type Severity = AlertColor;
export type LevelRating = string;

export type DialogData = {
  title: string;
  message: string;
  actions: DialogAction[];
};

export type ToastData = {
  severity?: Severity;
  message: string;
};

export type DefaultToastData = {
  toastData: ToastData;
};

export type WellData = {
  title?: string | null;
  message: string;
  severity?: AlertColor;
};

export type User = {
  _id: Id;
  email: string;
  username: string;
  customerId: Id;
  subscriptionId: string;
  subscriptionStatus: string;
  bookmarks: Id[];
  lastWatched: Id;
} | null;

// _id optional because created by MongoDb, so not required when registering
export type DbUser = {
  _id?: Id;
  email: string;
  username: string;
  password: string;
  customerId: Id;
  subscriptionId: string;
  subscriptionStatus: string;
  bookmarks: Id[];
  lastWatched: Id;
};

export type Ctx = {
  dialogData: DialogData | null | undefined;
  toastData: ToastData | null | undefined;
  selectedVideo: Course | null | undefined;
  selectedCategory: Category | null | undefined;
  user: User | null | undefined;
};

export type UpdateCtx = (newData: Partial<Ctx>) => void;

export type ContextProps = {
  updateCtx: UpdateCtx;
  ctx: Ctx;
};

export type CourseServerProps = {
  courses: Course[] | null;
  error: CustomError | null;
};

export type DialogAction = {
  label: string;
  onClick: () => void;
  closeOnClick?: boolean;
};

export type Course = {
  _id: Id;
  videoId: Id;
  title: string;
  description: string;
  artist: string;
  level: LevelRating;
  creationDate: DateString;
  categories: Category[];
};

export type DbCourse = {
  _id: Id;
  trailerId: string;
  courseId: string;
  title: string;
  description: string;
  artist: string;
  level: LevelRating;
  creationDate: DateString;
  categories: Category[];
};

export type CustomError = {
  message: string;
};

// FORM VALUES
export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export type UpdatePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type SubscribeFormValues = StripeModules;
export type ResubscribeFormValues = StripeModules;

export type DeleteFormValues = {
  password: string;
};
