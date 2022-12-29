import { FC, useContext, ReactElement, Dispatch, SetStateAction } from 'react';

import { useRouter } from 'next/router';

import { Drawer as MuiDrawer, Grid } from '@mui/material';

import {
  SidebarItem,
  HomeIcon,
  ProfileIcon,
  LoginIcon,
  LogoutIcon,
  BookmarksIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  RedditIcon,
  YouTubeIcon,
  HelpIcon,
  RegisterIcon,
} from '@/src/components';

import { Context, logout } from '@/src/utils';

import { User } from '@/src/utils/interfaces';

import { DEFAULT_SELECT_OPTION } from '@/src/utils/constants';

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

  const icons = [
    { Icon: FacebookIcon, url: 'https://www.facebook.com', label: 'Facebook' },
    {
      Icon: InstagramIcon,
      url: 'https://www.instagram.com',
      label: 'Instagram',
    },
    { Icon: TwitterIcon, url: 'https://www.twitter.com', label: 'Twitter' },
    { Icon: RedditIcon, url: 'https://www.reddit.com', label: 'Reddit' },
    { Icon: YouTubeIcon, url: 'https://www.youtube.com', label: 'YouTube' },
  ];

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const handleIconClick = () => {
    toggleDrawer();
    updateCtx({ selectedCategory: DEFAULT_SELECT_OPTION });
  };

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
          padding: '1rem 1rem 1rem 2rem',
          minWidth: '15.5rem',
          display: 'flex',
          justifyContent: 'center',
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
      >
        <SidebarItem
          Icon={HomeIcon}
          label='Home'
          href={!user ? '/' : '/dashboard'}
          isSelected={pathname === '/dashboard'}
          onClick={handleIconClick}
        />
        {!!user ? (
          <>
            <SidebarItem
              Icon={BookmarksIcon}
              label='My List'
              href='/list'
              isSelected={pathname === '/list'}
              onClick={handleIconClick}
            />
            <SidebarItem
              Icon={ProfileIcon}
              label='My Account'
              href='/account'
              isSelected={pathname === '/account'}
              onClick={handleIconClick}
            />
            <SidebarItem
              Icon={LogoutIcon}
              label='Logout'
              onClick={handleLogout}
            />
          </>
        ) : (
          <>
            <SidebarItem
              Icon={LoginIcon}
              label='Login'
              href='/login'
              isSelected={pathname === '/login'}
              onClick={handleIconClick}
            />
            <SidebarItem
              Icon={RegisterIcon}
              label='Register'
              href='/register'
              isSelected={pathname === '/register'}
              onClick={handleIconClick}
            />
          </>
        )}
        <SidebarItem
          Icon={HelpIcon}
          label='FAQ'
          href='/faq'
          isSelected={pathname === '/faq'}
          onClick={handleIconClick}
        />
      </Grid>

      <div
        style={{
          margin: '2rem 0',
          width: '100%',
          border: '0.5px solid #fff',
        }}
      />

      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='flex-start'
        gap={4}
      >
        {icons.map(({ Icon, url, label }) => (
          <SidebarItem
            key={label}
            Icon={Icon}
            label={label}
            href={url}
            onClick={handleIconClick}
          />
        ))}
      </Grid>
    </MuiDrawer>
  );
};

export default Drawer;
