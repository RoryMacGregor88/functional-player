import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { LoadMask } from '@/src/components';

export default function NotFound(): ReactElement {
  const { push } = useRouter();

  useEffect(() => {
    push('/dashboard');
    // TODO: toast notification here 'That page does not exist'
  }, [push]);

  return <LoadMask />;
}
