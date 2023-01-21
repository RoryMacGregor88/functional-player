import { FC, ReactElement, useState, ReactNode } from 'react';

import { Navbar, Footer, Drawer } from '@/src/components';

interface LayoutProps {
  children: ReactNode;
}

const LayoutContainer: FC<LayoutProps> = ({ children }): ReactElement => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '100vh',
    }}
  >
    {children}
  </div>
);

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }): ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <LayoutContainer>
      <Drawer isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      <Navbar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '85vh',
          overflow: 'hidden',
        }}
      >
        {children}
      </main>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
