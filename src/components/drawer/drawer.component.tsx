import { FC, useContext, ReactElement, Dispatch, SetStateAction } from 'react';

import { useRouter } from 'next/router';

import { Drawer as MuiDrawer, Grid } from '@mui/material';

import { SidebarItem, ProfileIcon } from '@/src/components';

import { http, Context, logout } from '@/src/utils';

import { User } from '@/src/utils/interfaces';

interface Props {
  user: User;
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const Drawer: FC<Props> = ({
  user,
  isDrawerOpen,
  setIsDrawerOpen,
}): ReactElement => {
  const { push, pathname } = useRouter();
  const { updateCtx } = useContext(Context);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const handleLogout = async () => {
    const res: boolean | undefined = await logout({
      user,
      updateCtx,
    });
    if (!!res) push('/login');
    toggleDrawer();
  };

  return (
    <MuiDrawer
      anchor='left'
      open={isDrawerOpen}
      onClose={toggleDrawer}
      sx={{
        '.MuiDrawer-paper': {
          padding: '1rem',
          minWidth: '15.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          backgroundColor: 'background.paper',
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      }}
      data-testid='drawer'
    >
      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='flex-start'
        gap={4}
        sx={{ height: '100%' }}
      >
        <SidebarItem
          Icon={ProfileIcon}
          label='Home'
          href={!user ? '/' : '/dashboard'}
          isSelected={pathname === '/dashboard'}
          onClick={toggleDrawer}
        />
        <SidebarItem
          Icon={ProfileIcon}
          label='Browse series'
          href='/series'
          isSelected={pathname === '/series'}
          onClick={toggleDrawer}
        />
        {!!user ? (
          <>
            <SidebarItem
              Icon={ProfileIcon}
              label='My List'
              href='/list'
              isSelected={pathname === '/list'}
              onClick={toggleDrawer}
            />
            <SidebarItem
              Icon={ProfileIcon}
              label='My Account'
              href='/account'
              isSelected={pathname === '/account'}
              onClick={toggleDrawer}
            />
            <SidebarItem
              Icon={ProfileIcon}
              label='Logout'
              onClick={handleLogout}
            />
          </>
        ) : (
          <>
            <SidebarItem
              Icon={ProfileIcon}
              label='Login'
              href='/login'
              isSelected={pathname === '/login'}
              onClick={toggleDrawer}
            />
            <SidebarItem
              Icon={ProfileIcon}
              label='Register'
              href='/register'
              isSelected={pathname === '/register'}
              onClick={toggleDrawer}
            />
          </>
        )}
        <SidebarItem
          Icon={ProfileIcon}
          label='FAQ'
          href='/faq'
          isSelected={pathname === '/faq'}
          onClick={toggleDrawer}
        />
      </Grid>
    </MuiDrawer>
  );
};

export default Drawer;
