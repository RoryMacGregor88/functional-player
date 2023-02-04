import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { LoadMask } from '@/src/components';

// TODO: might make into an advertising landing at some point

export default function Landing() {
  const { push } = useRouter();

  useEffect(() => {
    push('/dashboard');
  }, [push]);

  return <LoadMask />;
}
