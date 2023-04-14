import { FC, ReactElement } from 'react';

import { CircularProgress, SxProps, Theme } from '@mui/material';

import { THEME_COLORS } from '@/src/utils/constants';

interface Props {
  sx?: SxProps<Theme>;
}

const LoadingSpinner: FC<Props> = ({ sx = {} }): ReactElement => (
  <CircularProgress
    data-testid='loading-spinner'
    // Color is not from theme because spinner
    // in app is outside ThemeProvider
    sx={{ color: THEME_COLORS.mustardYellow, ...sx }}
  />
);

export default LoadingSpinner;
