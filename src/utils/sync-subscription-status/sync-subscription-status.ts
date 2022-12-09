import { http } from '@/src/utils';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

import { User, UpdateCtx } from '@/src/utils/interfaces';

interface Params {
  user: User | null;
  updateCtx: UpdateCtx;
}

export default async function syncSubscriptionStatus({
  user,
  updateCtx,
}: Params): Promise<{ ok: boolean }> {
  try {
    const { email, subscriptionStatus, subscriptionId } = user;
    const { error, resUser } = await http('/auth/sync-subscription-status', {
      email,
      subscriptionStatus,
      subscriptionId,
    });
    if (!!error) {
      await http('/auth/logout');
      updateCtx({
        user: null,
        toastData: {
          severity: 'error',
          message: error.message,
        },
      });
      return { ok: false };
    } else if (resUser) {
      updateCtx({ user: resUser });
      return { ok: true };
    }
  } catch (e) {
    updateCtx({
      user: null,
      toastData: {
        severity: 'error',
        message: DEFAULT_ERROR_MESSAGE,
      },
    });
    return { ok: false };
  }
}
