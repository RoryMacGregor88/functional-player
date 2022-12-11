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
}: Params): Promise<boolean | undefined> {
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
    await http({ endpoint: '/auth/logout', onError: handleError });
    updateCtx({
      user: null,
      toastData: {
        severity: 'error',
        message: error.message,
      },
    });
  } else if (resUser) {
    updateCtx({ user: resUser });
    // must return truthy value so that state can update in component
    return true;
  }
}
