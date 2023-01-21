import { FC, ReactElement, ReactNode } from 'react';

import { Box, Grid } from '@mui/material';

interface Props {
  restrictWidth?: boolean;
  children: ReactNode;
}

const PageWrapper: FC<Props> = ({
  restrictWidth = false,
  children,
}): ReactElement => (
  <Box
    sx={{
      width: '100%',
      margin: '0 auto',
      padding: '0 2rem',
    }}
  >
    {restrictWidth ? (
      <Grid
        container
        direction='column'
        alignItems='center'
        sx={{ maxWidth: '50rem', margin: '5rem auto' }}
      >
        {children}
      </Grid>
    ) : (
      children
    )}
  </Box>
);

export default PageWrapper;
