import { Dispatch, FC, ReactElement, SetStateAction } from 'react';

import { AppBar, Toolbar, Typography } from '@mui/material';

import { MenuIcon, IconButton, Link } from '@/src/components';

import { User } from '@/src/utils/interfaces';

// TODO: clicking logo does not close drawer

interface Props {
  user: User | null;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const Navbar: FC<Props> = ({ user, setIsDrawerOpen }): ReactElement => (
  <AppBar
    position='fixed'
    sx={{
      zIndex: 2000,
      border: 'none',
      backgroundColor: 'background.paper',
      boxShadow: 'none',
      backgroundImage: 'none',
    }}
  >
    <Toolbar
      disableGutters
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem',
        minHeight: 'fit-content !important',
      }}
    >
      <IconButton
        aria-label='menu'
        onClick={() => setIsDrawerOpen((prev) => !prev)}
        sx={{
          padding: '0',
          margin: 0,
        }}
      >
        <MenuIcon sx={{ height: '2rem', width: '2rem', marginRight: '1rem' }} />
      </IconButton>
      <Link href={!!user ? '/dashboard' : '/'} passHref>
        <Typography variant='h5' sx={{ cursor: 'pointer' }}>
          Functional Player
        </Typography>
      </Link>
    </Toolbar>
  </AppBar>
);

export default Navbar;
