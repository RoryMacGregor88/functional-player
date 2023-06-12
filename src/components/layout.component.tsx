import { FC, ReactElement, useState, ReactNode } from 'react';

import localFont from '@next/font/local';

import { Navbar, Footer, Drawer } from '@/src/components';

const folio = localFont({
  src: [
    {
      path: '../../public/fonts/folio-bold.ttf',
      weight: '400',
    },
    {
      path: '../../public/fonts/folio-bold.ttf',
      weight: '700',
    },
  ],
  variable: '--folio-bold',
});

interface LayoutProps {
  children: ReactNode;
}

const LayoutContainer: FC<LayoutProps> = ({ children }): ReactElement => (
  <div
    // className={`${folio.variable}`}
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '100vh',
      // fontFamily: `${folio.variable} !important`,
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
