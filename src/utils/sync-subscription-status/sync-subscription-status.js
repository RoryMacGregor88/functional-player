import { http, DEFAULT_ERROR_MESSAGE } from "@/src/utils";

/**
 * @param {object|null} user
 * @param {function} callback
 * @param {function|undefined} stateSetter
 */
export default async function syncSubscriptionStatus(
  user,
  callback,
  stateSetter
) {
  try {
    const { email, subscriptionStatus, subscriptionId } = user;
    const { error, resUser } = await http("/auth/sync-subscription-status", {
      email,
      subscriptionStatus,
      subscriptionId,
    });
    if (!!error) {
      await http("/auth/logout");
      callback({
        user: null,
        toastData: {
          severity: "error",
          message: error.message,
        },
      });
    } else if (resUser === null) {
      if (!!stateSetter) stateSetter(true);
      callback({ user: resUser });
    }
  } catch (e) {
    callback({
      user: null,
      toastData: {
        severity: "error",
        message: DEFAULT_ERROR_MESSAGE,
      },
    });
  }
}
