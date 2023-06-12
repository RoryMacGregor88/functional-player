import { FC, ReactElement } from 'react';

import { Typography, Grid, useMediaQuery } from '@mui/material';

import { Link, LinkButton } from '@/src/components';

import { THEME_COLORS } from '@/src/utils/constants';

const { mustardYellow } = THEME_COLORS;

// TODO: real terms/conditions
// also, Link text and underlines are both yellow, looks weird

const Footer: FC = (): ReactElement => {
  const isMobile = useMediaQuery('(max-width:600px)'),
    footerStyles = { color: mustardYellow };
  return (
    <Grid
      component='footer'
      container
      flexDirection={isMobile ? 'column' : 'row'}
      alignItems={isMobile ? 'center' : 'baseline'}
      justifyContent='center'
      gap='0.5rem'
      sx={{ padding: '1rem' }}
    >
      <Typography variant='body1' sx={{ ...footerStyles, textAlign: 'center' }}>
        COPYRIGHT &copy; {new Date().getFullYear()} FUNCTIONAL PLAYER
      </Typography>
      {!isMobile ? '|' : null}
      <Link href='/terms'>
        <LinkButton noLeftMargin sx={footerStyles}>
          TERMS &amp; CONDITIONS
        </LinkButton>
      </Link>
      {!isMobile ? '|' : null}
      <Link href='/privacy'>
        <LinkButton noLeftMargin sx={footerStyles}>
          PRIVACY POLICY
        </LinkButton>
      </Link>
    </Grid>
  );
};

export default Footer;
