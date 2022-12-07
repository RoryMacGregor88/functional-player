import { FC, ReactElement, ReactNode } from 'react';

import { Grid, Typography } from '@mui/material';

interface Props {
  children: ReactNode;
}

const SpacedTitle: FC<Props> = ({ children }): ReactElement => (
  <Grid
    item
    component={Typography}
    variant='h2'
    sx={{ width: '100%', margin: '2rem 0', textAlign: 'center' }}
  >
    {children}
  </Grid>
);

export default SpacedTitle;
