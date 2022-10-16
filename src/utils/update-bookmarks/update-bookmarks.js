import {
  http,
  DEFAULT_ERROR_MESSAGE,
  BOOKMARK_SUCCESS_REMOVE_MESSAGE,
  BOOKMARK_SUCCESS_ADD_MESSAGE,
} from "..";

// TODO: do something with this? Remember you have a dialog now!

// TODO: something wrong with bookmarking. Staying in bookmarks when not bookmarked, in bookmarks when white etc. Needs tightened!

export default async function updateBookmarks(_id, user = {}, callback) {
  try {
    const { email, bookmarks: currentBookmarks } = user;
    const isBookmarked = currentBookmarks.includes(_id);

    const bookmarks = isBookmarked
      ? currentBookmarks.filter((b) => b !== _id)
      : [...currentBookmarks, _id];

    // TODO: updatedUser returned here like others?
    const { ok } = await http("/update-bookmarks", {
      email,
      bookmarks,
    });

    if (ok) {
      callback({
        user: { ...user, bookmarks },
        toastData: {
          message: isBookmarked
            ? BOOKMARK_SUCCESS_REMOVE_MESSAGE
            : BOOKMARK_SUCCESS_ADD_MESSAGE,
        },
      });
    }
  } catch (error) {
    callback({
      toastData: {
        message: DEFAULT_ERROR_MESSAGE,
        severity: "error",
        stack: error,
      },
    });
  }
}
