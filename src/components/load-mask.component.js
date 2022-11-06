import { Backdrop } from '@mui/material';

import { LoadingSpinner } from '@/src/components';

import { THEME_COLORS } from '@/src/utils/constants';

// TODO: replace backdrop with real logo SVG

const LoadMask = () => (
  <Backdrop
    open
    // Background color is not from theme because spinner
    // in app is outside ThemeProvider
    sx={{ backgroundColor: THEME_COLORS.black, zIndex: '1000' }}
  >
    <LoadingSpinner />
  </Backdrop>
);

export default LoadMask;
