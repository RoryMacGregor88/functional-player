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

// TODO: setting user to null on error was removed from here. Why?

export default async function syncSubscriptionStatus({
  user,
  updateCtx,
}: Params): Promise<{ ok: boolean }> {
  let ok = false;
  const { email, subscriptionStatus, subscriptionId } = user;

  const { error, resUser }: ResProps = await http({
    endpoint: '/auth/sync-subscription-status',
    formData: {
      email,
      subscriptionStatus,
      subscriptionId,
    },
    onError: updateCtx,
  });
  if (!!error) {
    updateCtx({
      toastData: {
        severity: 'error',
        message: error.message,
      },
    });
  } else if (!!resUser) {
    ok = true;
    updateCtx({ user: resUser });
  }
  return { ok };
}
