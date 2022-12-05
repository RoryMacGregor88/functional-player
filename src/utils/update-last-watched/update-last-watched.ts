import { http } from '@/src/utils';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

// TODO: has not been typed, any others .ts files but not typed?

export default async function updateLastWatched(user, _id, updateCtx) {
  if (!!user) {
    try {
      const { error, resUser } = await http('/last-watched', {
        email: user.email,
        _id,
      });

      if (!!error) {
        updateCtx({
          toastData: {
            message: error.message,
            severity: 'error',
          },
        });
      } else if (!!user) {
        updateCtx({ user: resUser });
      }
    } catch (e) {
      updateCtx({
        toastData: {
          message: DEFAULT_ERROR_MESSAGE,
          severity: 'error',
        },
      });
    }
  }
}
