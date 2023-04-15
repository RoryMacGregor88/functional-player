import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { PageWrapper, LoadMask } from '@/src/components';
import Carousel from '@/src/components/carousel.component';

export default function Landing({ user }) {
  const { push } = useRouter();

  useEffect(() => {
    if (!!user) {
      push('/dashboard');
    }
  }, [push, user]);

  /** prevent flash of content before useEffect runs */
  if (user !== null) return <LoadMask showLogo />;

  return (
    <PageWrapper>
      <Carousel />
      <div>SOME OTHER STUFF HERE</div>
    </PageWrapper>
  );
}
