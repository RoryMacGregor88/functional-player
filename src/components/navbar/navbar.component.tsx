import { Dispatch, FC, ReactElement, SetStateAction } from 'react';

import { useRouter } from 'next/router';
import Image from 'next/image';

import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  SelectChangeEvent,
  useMediaQuery,
  Box,
} from '@mui/material';

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
  DEFAULT_SELECT_OPTION,
} from '@/src/utils/constants';

import Logo from '@/src/fp-logo.png';

interface Props {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const Navbar: FC<Props> = ({ isDrawerOpen, setIsDrawerOpen }): ReactElement => {
  const {
    updateCtx,
    ctx: { selectedCategory, user },
  } = useCtx();

  const isMobile = useMediaQuery('(max-width:700px)');

  const { push } = useRouter();

  // to make sure left/right elements are same width, for centering logo
  const ICON_SCALE = isMobile ? '1.75rem' : '2rem';

  const handleLogoClick = () => {
    if (isDrawerOpen) setIsDrawerOpen(false);
    updateCtx({ selectedCategory: null });
  };

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    const selectedCategory: Category = e.target.value;
    updateCtx({ selectedCategory });
    push(`/categories/?category=${selectedCategory}`);
  };

  // TODO: magic color in AppBar, and in Drawer

  return (
    <AppBar
      position='fixed'
      sx={{
        border: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
        {/* for centering logo at mobile sizes */}
        {isMobile ? <div style={{ width: ICON_SCALE }} /> : null}
        <Link href={'/dashboard'} onClick={handleLogoClick} disableHover>
          <Box
            sx={{
              height: isMobile ? '3.25rem' : '3.75rem',
              marginRight: isMobile ? '0.25rem' : '0',
            }}
          >
            <Image
              alt='fp-logo'
              src={Logo}
              style={{ width: 'inherit', height: 'inherit' }}
            />
          </Box>
          {/* {['Functional', 'Player'].map((str, i) => (
            <Typography
              key={str}
              variant='h5'
              sx={{
                cursor: 'pointer',
                fontSize: isMobile ? '1.5rem' : '1.8rem',
                fontWeight: 'bold',
                fontStyle: 'italic',
                color: i === 1 ? 'primary.main' : 'common.white',
              }}
            >
              {str}
            </Typography>
          ))} */}
        </Link>
        <Grid
          item
          container
          alignItems='center'
          wrap='nowrap'
          gap={2}
          sx={{ width: 'fit-content', textAlign: 'center' }}
        >
          {isMobile ? null : (
            <>
              <Select
                label={DEFAULT_SELECT_OPTION}
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
              sx={{ height: ICON_SCALE, width: ICON_SCALE }}
            />
          </IconButton>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default Navbar;
