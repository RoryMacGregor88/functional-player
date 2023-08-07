import { createTheme, ThemeOptions } from '@mui/material/styles';

import { THEME_COLORS } from '@/src/utils/constants';

const { offBlack, mustardYellow } = THEME_COLORS;

const theme: ThemeOptions = {
  shape: {
    borderRadius: 3,
  },
  typography: {
    fontFamily: 'Helvetica',
  },
  palette: {
    mode: 'dark',
    text: {
      primary: '#fff',
    },
    background: {
      paper: offBlack,
      default: offBlack,
    },
    primary: {
      main: mustardYellow,
    },
    common: {
      black: '#000',
      white: '#fff',
    },
  },
};

export default createTheme(theme);
