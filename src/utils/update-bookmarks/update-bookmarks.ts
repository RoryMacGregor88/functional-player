import { http } from '@/src/utils';

import {
  BOOKMARK_SUCCESS_REMOVE_MESSAGE,
  BOOKMARK_SUCCESS_ADD_MESSAGE,
} from '@/src/utils/constants';

import { User, Id, UpdateCtx } from '@/src/utils/interfaces';

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
}: Params): Promise<void> {
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

  if (error) {
    const { message } = error;
    updateCtx({
      toastData: {
        message,
        severity: 'error',
      },
    });
  } else if (resUser) {
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
