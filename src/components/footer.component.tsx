import { FC, ReactElement } from 'react';

import { Typography } from '@mui/material';

const Footer: FC = (): ReactElement => (
  <Typography variant='body1' sx={{ textAlign: 'center', margin: '1rem' }}>
    Copyright &copy; {new Date().getFullYear()} Functional Player | Terms &amp;
    Conditions | Privacy Policy
  </Typography>
);

export default Footer;
