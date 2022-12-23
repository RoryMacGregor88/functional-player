import { Dispatch, FC, ReactElement, SetStateAction, useContext } from 'react';

import { AppBar, Toolbar, Typography, Grid } from '@mui/material';

import { MenuIcon, Link, Select, IconButton } from '@/src/components';

import { User } from '@/src/utils/interfaces';

import { Context } from '@/src/utils';

import {
  CATEGORY_METADATA,
  COURSE_LEVEL_METADATA,
  DEFAULT_SELECT_OPTION,
} from '@/src/utils/constants';

interface Props {
  user: User;
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const Navbar: FC<Props> = ({
  user,
  isDrawerOpen,
  setIsDrawerOpen,
}): ReactElement => {
  const { updateCtx } = useContext(Context);

  const handleLogoClick = () => {
    if (isDrawerOpen) setIsDrawerOpen(false);
    updateCtx({ selectedCategory: DEFAULT_SELECT_OPTION });
  };

  return (
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
          minHeight: '0px !important',
        }}
      >
        <Grid item container sx={{ width: 'fit-content' }}>
          <IconButton
            aria-label='menu'
            onClick={() => setIsDrawerOpen((prev) => !prev)}
          >
            <MenuIcon
              data-testid='menu-icon'
              sx={{ height: '2rem', width: '2rem', marginRight: '1rem' }}
            />
          </IconButton>
          <Link href={'/dashboard'} onClick={handleLogoClick}>
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
};

export default Navbar;
