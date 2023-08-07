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
  const { email } = user;
  const { error, resUser }: ResProps = await http({
    endpoint: '/auth/logout',
    formData: { email },
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
  } else if (resUser === null) {
    updateCtx({
      user: resUser,
      toastData: {
        message: LOG_OUT_SUCCESS_MESSAGE,
      },
    });
    push('/login');
  }
}
