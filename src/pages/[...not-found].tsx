import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import { LoadMask } from '@/src/components';

export default function NotFound(): ReactElement {
  const { push } = useRouter();
  push('/dashboard');
  return <LoadMask />;
}
