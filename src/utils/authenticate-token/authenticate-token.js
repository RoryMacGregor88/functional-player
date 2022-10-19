import { http, DEFAULT_ERROR_MESSAGE } from "@/src/utils";

/** @param {function} callback */
export default async function authenticateToken(callback) {
  try {
    const { error, resUser } = await http(
      "/auth/authenticate-token",
      null,
      "GET"
    );
    if (!!resUser) {
      callback({ user: resUser });
    } else if (!!error) {
      callback({
        user: null,
        toastData: {
          severity: "error",
          message: error.message,
        },
      });
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
