import { AlertColor } from '@mui/material';

export type Id = string | number;
export type Token = string;
export type Category = string;
export type Artist = string;
export type DateString = string;
export type Severity = string;
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
  subscriptionId: Id;
  customerId: Id;
  subscriptionStatus: string;
  bookmarks: Id[];
  lastWatched: Id;
} | null;

export type Ctx = {
  dialogData: DialogData | null | undefined;
  toastData: ToastData | null | undefined;
  selectedVideo: Course | null | undefined;
  user: User | undefined;
};

export type UpdateCtx = (newData: Partial<Ctx>) => void;

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

export type CustomError = {
  message: string;
};
