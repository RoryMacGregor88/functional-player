import { http } from '@/src/utils';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

/** @param {function} callback */
export default async function authenticateToken(callback) {
  try {
    const { error, resUser } = await http(
      '/auth/authenticate-token',
      null,
      'GET'
    );
    if (!!error) {
      callback({
        user: null,
        toastData: {
          severity: 'error',
          message: error.message,
        },
      });
    } else if (!!resUser || resUser === null) {
      callback({ user: resUser });
    }
  } catch (e) {
    callback({
      user: null,
      toastData: {
        severity: 'error',
        message: DEFAULT_ERROR_MESSAGE,
      },
    });
  }
}
