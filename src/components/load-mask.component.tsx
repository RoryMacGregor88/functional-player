import { FC, ReactElement } from 'react';

import { Backdrop } from '@mui/material';

import { LoadingSpinner } from '@/src/components';

import { THEME_COLORS } from '@/src/utils/constants';

// TODO: replace loading spinner with real logo SVG

const LoadMask: FC = (): ReactElement => (
  <Backdrop
    open
    // Background color is not from theme because spinner
    // in app is outside ThemeProvider
    sx={{ backgroundColor: THEME_COLORS.darkBlack, zIndex: '1000' }}
  >
    <LoadingSpinner />
  </Backdrop>
);

export default LoadMask;
