import { FC, ReactElement, useState, ReactNode } from 'react';

import Head from 'next/head';

import { Navbar, Footer, Drawer } from '@/src/components';

import { User } from '@/src/utils/interfaces';

interface Props {
  user: User | null;
  children: ReactNode;
}

// TODO: custom font goes here: https://nextjs.org/docs/basic-features/font-optimization#google-fonts

const Layout: FC<Props> = ({ user, children }): ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <>
      <Head>
        <title>Functional Player</title>
      </Head>
      <Drawer
        user={user}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
      <Navbar user={user} setIsDrawerOpen={setIsDrawerOpen} />
      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: '85vh',
          overflow: 'hidden',
        }}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;