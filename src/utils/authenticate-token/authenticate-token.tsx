import { http } from '@/src/utils';

import { UpdateCtx, User, DefaultToastData } from '@/src/utils/interfaces';

interface Params {
  updateCtx: UpdateCtx;
}

interface ResProps {
  error: Error | undefined;
  resUser: User | undefined;
}

export default async function authenticateToken({
  updateCtx,
}: Params): Promise<void> {
  const { error, resUser }: ResProps = await http({
    endpoint: '/auth/authenticate-token',
    method: 'GET',
    onError: (defaultToastData: DefaultToastData) =>
      updateCtx({ ...defaultToastData, user: null }),
  });
  if (!!error) {
    console.log('ERROR: ', error);
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
}
