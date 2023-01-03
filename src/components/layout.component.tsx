import { FC, ReactElement, useState, ReactNode } from 'react';

import { Navbar, Footer, Drawer } from '@/src/components';

import { User } from '@/src/utils/interfaces';

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }): ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <>
      <Drawer isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      <Navbar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
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
