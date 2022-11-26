import { Dispatch, FC, ReactElement, SetStateAction } from 'react';

import { AppBar, Toolbar, Typography } from '@mui/material';

import { MenuIcon, IconButton, Link } from '@/src/components';

import { User } from '@/src/utils/interfaces';

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
        justifyContent: 'space-between',
        padding: '0.5rem',
        minHeight: 'fit-content !important',
      }}
    >
      <IconButton
        aria-label='menu'
        onClick={() => setIsDrawerOpen((prev) => !prev)}
      >
        <MenuIcon sx={{ height: '2rem', width: '2rem', marginRight: '1rem' }} />

      <Link href={!!user ? '/dashboard' : '/'} passHref>
        <Typography variant='h5' sx={{ cursor: 'pointer', height: '2rem' }}>
          Functional Player
        </Typography>
      </Link>
      </IconButton>
      {!!user ? (
        <Typography variant='h5' sx={{ fontSize: '1.25rem', paddingRight: '0.5rem' }}>
        Logged in as: {user.username}
      </Typography>
      ) : null}
    </Toolbar>
  </AppBar>
)

export default Navbar;
