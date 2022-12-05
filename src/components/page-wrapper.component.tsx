import { FC, ReactElement } from 'react';

import { Box } from '@mui/material';

interface Props {
  children: ReactElement;
}

const PageWrapper: FC<Props> = ({ children }): ReactElement => (
  <Box
    sx={{
      // maxWidth: '80rem',
      margin: '0 auto',
      padding: '0 2rem',
    }}
  >
    {children}
  </Box>
);

export default PageWrapper;
