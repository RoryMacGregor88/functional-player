import { http } from '@/src/utils';

import {
  BOOKMARK_SUCCESS_REMOVE_MESSAGE,
  BOOKMARK_SUCCESS_ADD_MESSAGE,
} from '@/src/utils/constants';

import { User, Id, UpdateCtx } from '@/src/utils/interfaces';

// TODO: something wrong with bookmarking. Staying in bookmarks when not bookmarked, in bookmarks when white etc. Needs tightened!

interface Params {
  _id: Id;
  user: User;
  updateCtx: UpdateCtx;
}

interface ResProps {
  error: Error | undefined;
  resUser: User;
}

export default async function updateBookmarks({
  _id,
  user,
  updateCtx,
}: Params) {
  const { email, bookmarks: currentBookmarks } = user;
  const isBookmarked = currentBookmarks.includes(_id);

  const bookmarks = isBookmarked
    ? currentBookmarks.filter((b) => b !== _id)
    : [...currentBookmarks, _id];

  const { error, resUser }: ResProps = await http({
    endpoint: '/update-bookmarks',
    formData: {
      email,
      bookmarks,
    },
    onError: updateCtx,
  });

  if (!!error) {
    updateCtx({
      toastData: {
        message: error.message,
        severity: 'error',
      },
    });
  } else if (!!resUser) {
    updateCtx({
      user: resUser,
      toastData: {
        message: isBookmarked
          ? BOOKMARK_SUCCESS_REMOVE_MESSAGE
          : BOOKMARK_SUCCESS_ADD_MESSAGE,
      },
    });
  }
}
