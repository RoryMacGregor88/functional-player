import { http } from '@/src/utils';

import {
  DEFAULT_ERROR_MESSAGE,
  BOOKMARK_SUCCESS_REMOVE_MESSAGE,
  BOOKMARK_SUCCESS_ADD_MESSAGE,
} from '@/src/utils/constants';

// TODO: something wrong with bookmarking. Staying in bookmarks when not bookmarked, in bookmarks when white etc. Needs tightened!

export default async function updateBookmarks(_id, user = {}, callback) {
  try {
    const { email, bookmarks: currentBookmarks } = user;
    const isBookmarked = currentBookmarks.includes(_id);

    const bookmarks = isBookmarked
      ? currentBookmarks.filter((b) => b !== _id)
      : [...currentBookmarks, _id];

    const { error, resBookmarks } = await http('/update-bookmarks', {
      email,
      bookmarks,
    });

    if (!!error) {
      callback({
        toastData: {
          message: error.message,
          severity: 'error',
        },
      });
    } else if (!!resBookmarks) {
      callback({
        user: { ...user, bookmarks: resBookmarks },
        toastData: {
          message: isBookmarked
            ? BOOKMARK_SUCCESS_REMOVE_MESSAGE
            : BOOKMARK_SUCCESS_ADD_MESSAGE,
        },
      });
    }
  } catch (e) {
    callback({
      toastData: {
        message: DEFAULT_ERROR_MESSAGE,
        severity: 'error',
      },
    });
  }
}
