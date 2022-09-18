export const SERIES = "series-2";
export const USERS = "users-2";

export const PASSWORD_MIN = 5;
export const PASSWORD_MAX = 15;

export const DEFAULT_ERROR_MESSAGE = "An unexpected error has occurred.";

export const HTTP_METHOD_ERROR_MESSAGE =
  "Invalid method, only POST requests permitted.";

export const DEFAULT_TOKEN_FORBIDDEN_MESSAGE =
  "Not allowed. Authorization token required.";

export const BOOKMARK_SUCCESS_ADD_MESSAGE = "Added to your list";
export const BOOKMARK_SUCCESS_REMOVE_MESSAGE = "Removed from your list";

// form validation
export const EMAIL_REQUIRED_MESSAGE = "Email is required";
export const USERNAME_REQUIRED_MESSAGE = "Username is required";
export const EMAIL_INVALID_MESSAGE =
  "Email must include '@' and '.' characters";
export const PASSWORD_REQUIRED_MESSAGE = "Password is required";
export const PASSWORD_CONFIRM_REQUIRED_MESSAGE =
  "Password confirmation is required";
export const PASSWORDS_MATCH_MESSAGE = "Passwords do not match";
export const PASSWORD_MIN_LENGTH_MESSAGE =
  "Password must be at least 5 characters";

// All possible Stripe scenarios. Just for explicitness, not all are used
export const STATUS_LABELS = {
  active: "Active",
  incomplete: "Incomplete",
  incomplete_expired: "Incomplete expired",
  trialing: "Trialing",
  past_due: "Past due",
  unpaid: "Unpaid",
  canceled: "Cancelled",
};
