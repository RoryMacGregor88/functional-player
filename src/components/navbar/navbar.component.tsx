import { Dispatch, FC, ReactElement, SetStateAction } from 'react';

import { useRouter } from 'next/router';
import Image from 'next/image';

import {
  AppBar,
  Toolbar,
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
  Button,
} from '@/src/components';

import { Category } from '@/src/utils/interfaces';

import { useCtx } from '@/src/utils';

import {
  CATEGORY_METADATA,
  COURSE_LEVEL_METADATA,
  DEFAULT_SELECT_OPTION,
} from '@/src/utils/constants';

import Logo from '@/src/fp-logo.png';

// old buttons in case needed
{
  /* <LinkButton noLeftMargin>Log in</LinkButton> */
}

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
        <Link href={'/dashboard'} onClick={handleLogoClick} disableHover>
          <Box sx={{ height: '3rem' }}>
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
          alignItems='stretch'
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
                    <Button
                      sx={{
                        padding: '0',
                        height: 'calc(100% - 2px)',
                      }}
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href='/register'>
                    <Button
                      sx={{
                        padding: '0',
                        height: 'calc(100% - 2px)',
                      }}
                    >
                      Sign Up
                    </Button>
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
