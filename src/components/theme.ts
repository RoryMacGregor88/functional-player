import { createTheme, ThemeOptions } from '@mui/material/styles';

// import { Open_Sans } from '@next/font/google';

// TODO: black colors are mixed up in header, main, footer
// also, theme types are all fucked

import { THEME_COLORS } from '@/src/utils/constants';

const { offBlack, mustardYellow } = THEME_COLORS;

// const openSans = Open_Sans({ weight: '400', subsets: ['latin'] });

const theme: ThemeOptions = {
  shape: {
    borderRadius: 3,
  },
  typography: {
    fontFamily: 'Helvetica',
  },
  palette: {
    mode: 'dark',
    // This is maybe not necessary when using all Mui components
    text: {
      primary: '#fff',
    },
    background: {
      paper: offBlack,
      // TODO: change this to something better
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
