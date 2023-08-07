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
  if (user) {
    const { error, resUser }: ResProps = await http({
      endpoint: '/last-watched',
      formData: {
        email: user.email,
        _id,
      },
      onError: updateCtx,
    });

    if (error) {
      // this is a background action,
      // doesn't really matter if it's not error-handled
      return;
    } else if (user) {
      updateCtx({ user: resUser });
    }
  }
}
