import { http } from '@/src/utils';

import { User, UpdateCtx } from '@/src/utils/interfaces';

interface Params {
  user: User;
  updateCtx: UpdateCtx;
}

interface ResProps {
  error: Error | undefined;
  resUser: User | undefined;
}

export default async function logout({
  user,
  updateCtx,
}: Params): Promise<{ ok: boolean }> {
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
    updateCtx({ user: resUser });
    // must return truthy value to invoke router
    return { ok: true };
  }
  return { ok: false };
}
