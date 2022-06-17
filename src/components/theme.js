import { createTheme } from "@mui/material/styles";

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
    borderRadius: "5px",
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
};

export default createTheme(theme);
