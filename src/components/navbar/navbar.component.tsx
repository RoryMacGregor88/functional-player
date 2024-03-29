import { Dispatch, FC, ReactElement, SetStateAction } from 'react';

import { useRouter } from 'next/router';
import Image from 'next/image';

import { AppBar, Toolbar, Grid, useMediaQuery, Box } from '@mui/material';

import {
  MenuIcon,
  Link,
  Select,
  IconButton,
  ProfileIcon,
  LinkButton,
} from '@/src/components';

import { Category } from '@/src/utils/interfaces';

import { useCtx } from '@/src/utils';

import {
  CATEGORY_METADATA,
  COURSE_LEVEL_METADATA,
} from '@/src/utils/constants';

import Logo from '@/src/functional-player-logo.svg';

interface Props {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const Navbar: FC<Props> = ({ isDrawerOpen, setIsDrawerOpen }): ReactElement => {
  const {
    updateCtx,
    ctx: { selectedCategory, user },
  } = useCtx();

  const isMobile = useMediaQuery('(max-width:950px)');

  const { push } = useRouter();

  const handleLogoClick = () => {
    if (isDrawerOpen) setIsDrawerOpen(false);
    updateCtx({ selectedCategory: null });
  };

  const handleCategoryChange = (selectedCategory: Category) => {
    updateCtx({ selectedCategory });
    push(`/categories/?category=${selectedCategory}`);
  };

  return (
    <AppBar
      position='fixed'
      sx={{
        border: 'none',
        backgroundColor: 'rgba(21, 21, 21, 0.9)',
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
          height: '100%',
          padding: '0.5rem 1rem',
          minHeight: '0px !important',
        }}
      >
        <Link href={'/dashboard'} onClick={handleLogoClick} disableHover>
          <Box sx={{ height: isMobile ? '1rem' : '1.5rem' }}>
            <Image
              data-testid='fp-logo'
              alt='fp-logo'
              src={Logo}
              style={{ width: 'inherit', height: 'inherit' }}
            />
          </Box>
        </Link>
        <Grid
          item
          container
          alignItems='stretch'
          wrap='nowrap'
          gap={2}
          sx={{ width: 'fit-content', textAlign: 'center' }}
        >
          {isMobile ? null : (
            <>
              <Select
                label='Explore by category...'
                options={[...CATEGORY_METADATA, ...COURSE_LEVEL_METADATA]}
                selectedCategory={selectedCategory ?? ''}
                handleCategoryChange={handleCategoryChange}
              />
              {!!user ? (
                <Link href='/account'>
                  <ProfileIcon />
                </Link>
              ) : (
                <>
                  <Link href='/login'>
                    <LinkButton noLeftMargin>Log in</LinkButton>
                  </Link>
                  <Link href='/register'>
                    <LinkButton noLeftMargin>Sign Up</LinkButton>
                  </Link>
                </>
              )}
            </>
          )}
          <IconButton
            aria-label='menu'
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            sx={{
              visibility: isDrawerOpen ? 'hidden' : 'visible',
            }}
          >
            <MenuIcon
              data-testid='menu-icon'
              sx={{ height: '2rem', width: '2rem' }}
            />
          </IconButton>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default Navbar;
