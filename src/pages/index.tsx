import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { LoadMask } from '@/src/components';

export default function Landing({ user }) {
  const { push } = useRouter();

  useEffect(() => {
    if (!!user) push('/dashboard');
  }, [push, user]);

  return !user ? (
    <h1>ABCDEFGHIJKLMNOPQRSTUVWXYZ FUNCTIONALPLAYER</h1>
  ) : (
    <LoadMask />
  );
}
