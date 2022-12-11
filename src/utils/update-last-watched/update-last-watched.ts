import { http } from '@/src/utils';

import { User, Id, UpdateCtx } from '@/src/utils/interfaces';

interface Params {
  user: User;
  _id: Id;
  updateCtx: UpdateCtx;
}

interface ResProps {
  error: Error | undefined;
  resUser: User | undefined;
}

export default async function updateLastWatched({
  user,
  _id,
  updateCtx,
}: Params): Promise<void> {
  if (!!user) {
    const { error, resUser }: ResProps = await http({
      endpoint: '/last-watched',
      formData: {
        email: user.email,
        _id,
      },
      onError: updateCtx,
    });

    if (!!error) {
      // TODO: should we be notifying user of this? More of a background thing.
      updateCtx({
        toastData: {
          message: error.message,
          severity: 'error',
        },
      });
    } else if (!!user) {
      updateCtx({ user: resUser });
    }
  }
}
