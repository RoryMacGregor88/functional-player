import { FC, ReactElement } from 'react';

import { Typography, Grid, useMediaQuery } from '@mui/material';

import { Link, LinkButton } from '@/src/components';

// TODO: real terms/conditions

const Footer: FC = (): ReactElement => {
  const isMobile = useMediaQuery('(max-width:600px)');
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
      <Typography variant='body1' sx={{ textAlign: 'center' }}>
        Copyright &copy; {new Date().getFullYear()} Functional Player
      </Typography>
      {!isMobile ? '|' : null}
      <Link href='/terms'>
        <LinkButton noLeftMargin>Terms &amp; Conditions</LinkButton>
      </Link>
      {!isMobile ? '|' : null}
      <Link href='/privacy'>
        <LinkButton noLeftMargin>Privacy Policy</LinkButton>
      </Link>
    </Grid>
  );
};

export default Footer;
