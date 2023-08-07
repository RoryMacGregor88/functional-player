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

/**
 * User is not set to null on error here because the logout handler
 * is called if `ok` is returned false. Setting user to null here is
 * pointless, because it only sets it in state. There will still be a
 * session in the browser, so calling `logout` is the better solution
 */
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
  if (error) {
    const { message } = error;
    updateCtx({
      toastData: {
        severity: 'error',
        message,
      },
    });
  } else if (resUser) {
    ok = true;
    updateCtx({ user: resUser });
  }
  return { ok };
}
