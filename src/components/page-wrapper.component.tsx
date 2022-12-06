import { FC, ReactElement, ReactNode } from 'react';

import { Box } from '@mui/material';

interface Props {
  children: ReactNode;
}

const PageWrapper: FC<Props> = ({ children }): ReactElement => (
  <Box
    sx={{
      margin: '0 auto',
      padding: '0 2rem',
    }}
  >
    {children}
  </Box>
);

export default PageWrapper;
