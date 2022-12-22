import { FC, ReactElement } from 'react';

import { Typography } from '@mui/material';

import { Link } from '@/src/components';

// TODO: real terms/conditions

const Footer: FC = (): ReactElement => (
  <Typography variant='body1' sx={{ textAlign: 'center', margin: '1rem' }}>
    Copyright &copy; {new Date().getFullYear()} Functional Player |{' '}
    <Link href='/terms'>Terms &amp; Conditions</Link> |{' '}
    <Link href='/privacy'>Privacy Policy</Link>
  </Typography>
);

export default Footer;
