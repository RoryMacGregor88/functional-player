import { FC, ReactElement, ReactNode } from 'react';

import { Grid, Typography, useMediaQuery } from '@mui/material';

interface Props {
  children: ReactNode;
}

const SpacedTitle: FC<Props> = ({ children }): ReactElement => {
  const isMobile = useMediaQuery('(max-width:700px)');
  return (
    <Grid
      item
      component={Typography}
      variant='h1'
      sx={{
        width: '100%',
        margin: '2rem 0',
        textAlign: 'center',
        fontSize: isMobile ? '1.5rem' : '2rem',
      }}
    >
      {children}
    </Grid>
  );
};

export default SpacedTitle;
