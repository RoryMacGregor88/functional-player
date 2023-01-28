import { Dispatch, FC, ReactElement, SetStateAction } from 'react';

import { useRouter } from 'next/router';

import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  SelectChangeEvent,
  useMediaQuery,
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

// to make sure left/right elements are same width, for centering logo
const ICON_WIDTH = '2rem';

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
        height: '4.375rem',
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
        {isMobile ? <div style={{ width: ICON_WIDTH }} /> : null}
        <Link href={'/dashboard'} onClick={handleLogoClick}>
          <Typography
            variant='h5'
            sx={{ cursor: 'pointer', fontSize: '1.8rem', fontWeight: 'bold' }}
          >
            FunctionalPlayer
          </Typography>
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
              sx={{ height: ICON_WIDTH, width: ICON_WIDTH }}
            />
          </IconButton>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default Navbar;
