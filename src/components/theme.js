import { createTheme } from "@mui/material/styles";

const BORDER_RADIUS = "5px";

// TODO: black colors are mixed up in header, main, footer

const boneWhite = "#faf9f7",
  // primary
  lightBlack = "#121212",
  // secondary
  darkBlack = "#080808",
  // hovers
  lightGrey = "#757575",
  //dividers
  darkGrey = "#242424";

const theme = {
  shape: {
    borderRadius: BORDER_RADIUS,
  },
  palette: {
    mode: "dark",
    // This is maybe not necessary when using all Mui components
    text: {
      primary: boneWhite,
    },
    background: {
      paper: darkBlack,
      default: lightBlack,
    },
    primary: {
      main: boneWhite,
    },
    secondary: {
      main: lightGrey,
    },
  },
  // components: {
  //   MuiTextField: {
  //     styleOverrides: {
  //       input: {
  //         WebkitBoxShadow: "0 0 0 1000px #ff0000 inset",
  //       },
  //     },
  //   },
  // },
};

export default createTheme(theme);
