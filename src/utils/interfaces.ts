export type Id = string | number;

export type Severity = 'success' | 'error';

export type DialogData = {
  title: string;
  message: string;
  actions: DialogAction[];
};

export type ToastData = {
  severity?: Severity;
  message: string;
};

export type Ctx = {
  dialogData: DialogData | null | undefined;
  toastData: ToastData | null | undefined;
  selectedVideo: Course | null | undefined;
  user: User | null | undefined;
};

export type UpdateCtx = (newData: Partial<Ctx>) => void;

export interface DialogAction {
  label: string;
  onClick: () => void;
  closeOnClick?: boolean;
}

export interface User {
  _id: Id;
  email: string;
  username: string;
  subscriptionId: Id;
  customerId: Id;
  subscriptionStatus: string;
  bookmarks: Id[];
  lastWatched: Id;
}

export interface Course {
  _id: Id;
  videoId: Id;
  title: string;
  description: string;
  coursePath: string;
  seriesPath: string;
  creationDate: Date;
}

export interface Series {
  _id: Id;
  title: string;
  description: string;
  seriesPath: string;
  courses: Course[];
  creationDate: Date;
}
