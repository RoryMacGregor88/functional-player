import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { LoadMask } from '@/src/components';

export default function Landing({ user }) {
  const { push } = useRouter();

  useEffect(() => {
    push('/dashboard');
  }, [push, user]);

  return <LoadMask showLogo />;
}
