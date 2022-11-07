import { http } from '@/src/utils';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

import { UpdateCtx, User } from '@/src/utils/interfaces';

interface ResProps {
  error: Error | undefined;
  resUser: User | null | undefined;
}

export default async function authenticateToken(
  updateCtx: UpdateCtx
): Promise<void> {
  try {
    const { error, resUser }: ResProps = await http(
      '/auth/authenticate-token',
      null,
      'GET'
    );
    if (!!error) {
      updateCtx({
        user: null,
        toastData: {
          severity: 'error',
          message: error.message,
        },
      });
    } else if (!!resUser || resUser === null) {
      updateCtx({ user: resUser });
    }
  } catch (e) {
    updateCtx({
      user: null,
      toastData: {
        severity: 'error',
        message: DEFAULT_ERROR_MESSAGE,
      },
    });
  }
}
