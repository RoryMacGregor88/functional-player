import { http } from '@/src/utils';

import { User, UpdateCtx } from '@/src/utils/interfaces';

import { LOG_OUT_SUCCESS_MESSAGE } from '@/src/utils/constants';

interface Params {
  user: User;
  updateCtx: UpdateCtx;
  push: (href: string) => void;
}

interface ResProps {
  error: Error | undefined;
  resUser: User | undefined;
}

export default async function logout({
  user,
  updateCtx,
  push,
}: Params): Promise<void> {
  const { error, resUser }: ResProps = await http({
    endpoint: '/auth/logout',
    formData: { email: user.email },
    onError: updateCtx,
  });
  if (!!error) {
    updateCtx({
      toastData: {
        message: error.message,
        severity: 'error',
      },
    });
  } else if (resUser === null) {
    push('/login');
    updateCtx({
      user: resUser,
      toastData: {
        message: LOG_OUT_SUCCESS_MESSAGE,
      },
    });
  }
}
