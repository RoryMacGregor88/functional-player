import { FC, ReactElement, useState } from 'react';

import { Navbar, Footer, Drawer } from '@/src/components';

import { User } from '@/src/utils/interfaces';

interface Props {
  user: User | null;
  children: ReactElement;
}

const Layout: FC<Props> = ({ user, children }): ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <>
      <Drawer
        user={user}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
      <Navbar
        user={user}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
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
