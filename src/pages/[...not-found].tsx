import { ReactElement } from 'react'

import { useRouter } from 'next/router';

import { LoadMask } from '@/src/components';

import { User } from '@/src/utils/interfaces'

interface Props {
  user: User;
}

export default function NotFound({ user }: Props): ReactElement {
  const { push } = useRouter();
  push(!!user ? '/dashboard' : '/');
  return <LoadMask />;
}
