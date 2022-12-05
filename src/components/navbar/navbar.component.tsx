import { Dispatch, FC, ReactElement, SetStateAction } from 'react';

import { AppBar, Toolbar, Typography, Grid } from '@mui/material';

import { MenuIcon, Link, Select, IconButton } from '@/src/components';

import { User } from '@/src/utils/interfaces';

import {
  CATEGORY_METADATA,
  COURSE_LEVEL_METADATA,
} from '@/src/utils/constants';

interface Props {
  user: User | null;
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const Navbar: FC<Props> = ({
  user,
  isDrawerOpen,
  setIsDrawerOpen,
}): ReactElement => (
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
    <Grid
      component={Toolbar}
      container
      alignItems='center'
      justifyContent='space-between'
      wrap='nowrap'
      disableGutters
      sx={{
        width: '100%',
        padding: '0.5rem 2rem',
        minHeight: '4rem !important',
      }}
    >
      <Grid item container sx={{ width: 'fit-content' }}>
        <IconButton
          aria-label='menu'
          onClick={() => setIsDrawerOpen((prev) => !prev)}
        >
          <MenuIcon
            sx={{ height: '2rem', width: '2rem', marginRight: '1rem' }}
          />
        </IconButton>
        <Link
          href={!!user ? '/dashboard' : '/'}
          onClick={isDrawerOpen ? () => setIsDrawerOpen(false) : null}
          passHref
        >
          <Typography variant='h5' sx={{ cursor: 'pointer', height: '2rem' }}>
            Functional Player
          </Typography>
        </Link>
      </Grid>
      <Grid
        item
        container
        alignItems='center'
        gap={2}
        sx={{ width: 'fit-content' }}
      >
        <Select options={[...CATEGORY_METADATA, ...COURSE_LEVEL_METADATA]} />
        {!!user ? (
          <Typography
            variant='h5'
            sx={{ fontSize: '1.25rem', paddingRight: '0.5rem' }}
          >
            Logged in as: {user.username}
          </Typography>
        ) : null}
      </Grid>
    </Grid>
  </AppBar>
);

export default Navbar;
