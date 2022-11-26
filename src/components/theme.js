import { createTheme } from '@mui/material/styles';

import { Open_Sans } from '@next/font/google'

// TODO: black colors are mixed up in header, main, footer

import { THEME_COLORS } from '@/src/utils/constants';

const { white, black, yellow, green, red } = THEME_COLORS;

const openSans = Open_Sans({ weight: '400', subsets: ['latin'] })

const theme = {
  shape: {
    borderRadius: 5,
  },
  typography: {
    fontFamily: openSans.style.fontFamily
  },
  palette: {
    mode: 'dark',
    // This is maybe not necessary when using all Mui components
    text: {
      primary: white,
    },
    background: {
      paper: black,
      // change this to something better
      default: black,
    },
    primary: {
      main: yellow,
    },
    secondary: {
      main: green,
    },
    error: {
      main: red,
    },
    success: {
      main: green,
    },
    common: {
      black: '#000',
      white: '#fff',
    },
  },
};

export default createTheme(theme);
