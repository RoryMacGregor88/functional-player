import { FC, ReactElement } from 'react';

import { Typography, Grid } from '@mui/material';

import { Link, LinkButton } from '@/src/components';

// TODO: real terms/conditions

const Footer: FC = (): ReactElement => (
  <Grid
    component='footer'
    container
    alignItems='baseline'
    justifyContent='center'
    gap='0.5rem'
    sx={{ padding: '1rem' }}
  >
    <Typography variant='body1' sx={{ textAlign: 'center' }}>
      Copyright &copy; {new Date().getFullYear()} Functional Player
    </Typography>
    {'|'}
    <Link href='/terms'>
      <LinkButton noLeftMargin>Terms &amp; Conditions</LinkButton>
    </Link>
    {'|'}
    <Link href='/privacy'>
      <LinkButton noLeftMargin>Privacy Policy</LinkButton>
    </Link>
  </Grid>
);

export default Footer;
