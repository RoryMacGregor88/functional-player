import { http } from '@/src/utils';

import { User, UpdateCtx, DefaultToastData } from '@/src/utils/interfaces';

interface Params {
  user: User;
  updateCtx: UpdateCtx;
}

interface ResProps {
  error: Error | undefined;
  resUser: User | undefined;
}

export default async function syncSubscriptionStatus({
  user,
  updateCtx,
}: Params): Promise<{ ok: boolean }> {
  const handleError = (defaultToastData: DefaultToastData) =>
    updateCtx({ ...defaultToastData, user: null });

  const { email, subscriptionStatus, subscriptionId } = user;

  const { error, resUser }: ResProps = await http({
    endpoint: '/auth/sync-subscription-status',
    formData: {
      email,
      subscriptionStatus,
      subscriptionId,
    },
    onError: handleError,
  });
  if (!!error) {
    updateCtx({
      user: null,
      toastData: {
        severity: 'error',
        message: error.message,
      },
    });
  } else if (!!resUser) {
    updateCtx({ user: resUser });
    // must return truthy value so that state can update in component
    return { ok: true };
  }
  await http({ endpoint: '/auth/logout', onError: handleError });
  return { ok: false };
}
