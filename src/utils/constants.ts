// TODO: Move all notification messages to constants

export const SERIES = 'series-2';
export const COURSES = 'courses';
export const USERS = 'users-2';

export const PASSWORD_MIN = 5;
export const PASSWORD_MAX = 15;

export const DEFAULT_ERROR_MESSAGE = 'An unexpected error has occurred.';

export const HTTP_METHOD_ERROR_MESSAGE =
  'Invalid method. Only POST requests permitted.';

export const TOKEN_ERROR_MESSAGE = 'Not allowed. Authorization token required.';

export const EMAIL_NOT_FOUND_MESSAGE =
  'No user account associated with that email address.';

export const REGISTRATION_SUCCESS_MESSAGE =
  'Account successfully created. Click "NEXT" button to continue.';

export const ACCOUNT_DELETE_SUCCESS_MESSAGE =
  'Your account and subscription have been permanently deleted.';

export const BOOKMARK_SUCCESS_ADD_MESSAGE = 'Added to your list';
export const BOOKMARK_SUCCESS_REMOVE_MESSAGE = 'Removed from your list';

export const REACTIVATION_SUCCESS_MESSAGE =
  'Your subscription has been successfully reactivated.';

// form validation
export const EMAIL_REQUIRED_MESSAGE = 'Email is required';
export const USERNAME_REQUIRED_MESSAGE = 'Username is required';
export const EMAIL_INVALID_MESSAGE =
  'Email must include "@" and "." characters';
export const PASSWORD_REQUIRED_MESSAGE = 'Password is required';
export const NEW_PASSWORD_REQUIRED_MESSAGE = 'Password is required';
export const PASSWORD_CONFIRM_REQUIRED_MESSAGE =
  'Password confirmation is required';
export const NO_PASSWORD_MATCH_MESSAGE = 'Passwords do not match';
export const PASSWORD_MIN_LENGTH_MESSAGE =
  'Password must be at least 5 characters';
export const PASSWORD_UPDATE_SUCCESS_MESSAGE =
  'Your password has been successfully updated.';

// All possible Stripe scenarios. Just for explicitness, not all are used
export const STATUS_LABELS = {
  active: 'Active',
  incomplete: 'Incomplete',
  incomplete_expired: 'Incomplete expired',
  trialing: 'Trialing',
  past_due: 'Past due',
  unpaid: 'Unpaid',
  canceled: 'Cancelled',
};

export const THEME_COLORS = {
  boneWhite: '#faf9f7',
  lightBlack: '#121212',
  darkBlack: '#080808',
  lightGrey: '#757575',
  darkGrey: '#242424',
  amazonOrange: '#ff9900',
};

// export const THEME_COLORS = {
//   white: '#dfe2cc',
//   black: '#140c0b',
//   yellow: '#f2960b',
//   green: '#0ca464',
//   red: '#c31e1e',
// };

// TODO: this metadata stuff is getting out of hand, do this better!!!
export const COURSE_LEVEL_METADATA = [
  {
    label: 'Beginner',
    value: 'beginner',
    color: '#0ca464',
  },
  {
    label: 'Intermediate',
    value: 'intermediate',
    color: '#dfe2cc',
  },
  {
    label: 'Advanced',
    value: 'advanced',
    color: '#c31e1e',
  },
];

export const ARTIST_METADATA = [
  {
    label: 'Joe Bonamassa',
    value: 'joe-bonamassa',
  },
  {
    label: 'Gary Moore',
    value: 'gary-moore',
  },
  {
    label: 'Peter Green',
    value: 'peter-green',
  },
];

export const CATEGORY_METADATA = [
  {
    label: 'Artist',
    value: 'artist',
  },
  {
    label: 'Live Solos',
    value: 'liveSolos',
  },
  {
    label: 'Blues',
    value: 'blues',
  },
  {
    label: 'Rock',
    value: 'rock',
  },
  {
    label: 'Country',
    value: 'country',
  },
  {
    label: 'Funk',
    value: 'funk',
  },
  {
    label: 'Hidden Gems',
    value: 'hiddenGems',
  },
];

export const CHARS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];
