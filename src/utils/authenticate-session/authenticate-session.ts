import { http } from '@/src/utils';

import { UpdateCtx, User, DefaultToastData } from '@/src/utils/interfaces';

interface Params {
  updateCtx: UpdateCtx;
}

interface ResProps {
  error?: Error;
  resUser?: User;
  redirect?: boolean;
}

export default async function authenticateSession({
  updateCtx,
}: Params): Promise<boolean> {
  const { error, resUser, redirect }: ResProps = await http({
    endpoint: '/auth/authenticate-session',
    method: 'GET',
    onError: (defaultToastData: DefaultToastData) =>
      updateCtx({ ...defaultToastData, user: null }),
  });
  if (error) {
    const { message } = error;
    updateCtx({
      user: null,
      toastData: {
        severity: 'error',
        message,
      },
    });
  } else if (resUser || resUser === null) {
    updateCtx({ user: resUser });
  }
  return !!redirect;
}
