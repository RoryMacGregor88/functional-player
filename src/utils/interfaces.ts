export type Id = string | number;
export type Token = string;
export type Category = string;
export type Artist = string;
export type DateString = string;

export type Severity = 'success' | 'error';

// TODO: this is causing problems with types, string not equal to LevelRating
export type LevelRating = 'beginner' | 'intermediate' | 'advanced';

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
  artist: string;
  level: LevelRating;
  creationDate: DateString;
  categories: Category[];
}

export interface CustomError {
  message: string;
}
