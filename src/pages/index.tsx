import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { PageWrapper } from '@/src/components';
import Carousel from '@/src/components/carousel.component';

// TODO: maybe make into an advertising landing at some point

export default function Landing({ user }) {
  const { push } = useRouter();

  useEffect(() => {
    if (!!user) {
      push('/dashboard');
    }
  }, [push, user]);

  return (
    <PageWrapper>
      <Carousel />
      <div>SOME OTHER STUFF HERE</div>
    </PageWrapper>
  );
}
