import { createTheme } from '@mui/material/styles';

import { Open_Sans } from '@next/font/google'

// TODO: black colors are mixed up in header, main, footer

import { THEME_COLORS } from '@/src/utils/constants';

const { boneWhite, lightBlack, amazonOrange } = THEME_COLORS;

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
      primary: boneWhite,
    },
    background: {
      paper: lightBlack,
      // change this to something better
      default: lightBlack,
    },
    primary: {
      main: amazonOrange,
    },
    common: {
      black: '#000',
      white: '#fff',
    },
  },
};

export default createTheme(theme);
