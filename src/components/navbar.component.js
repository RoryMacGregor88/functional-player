import NextLink from "next/link";

import { AppBar, Toolbar, Typography } from "@mui/material";

import { MenuIcon, IconButton } from "@/src/components";

/**
 * @param {{
 *  user?: object,
 *  drawerIsOpen: boolean,
 *  toggleDrawer: function
 * }} props
 */
const Navbar = ({ user, drawerIsOpen, toggleDrawer }) => {
  const options = {
    padding: "0",
    visibility: drawerIsOpen ? "hidden" : "visible",
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: "1100",
        border: "none",
        backgroundColor: "transparent",
        boxShadow: "none",
        backgroundImage: "none",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 1rem",
          minHeight: "fit-content !important",
        }}
      >
        <NextLink href={!!user ? "/dashboard" : "/"} passHref>
          <Typography variant="h4" sx={{ cursor: "pointer" }}>
            Functional Player
          </Typography>
        </NextLink>
        <IconButton aria-label="menu" onClick={toggleDrawer} sx={options}>
          <MenuIcon sx={{ height: "2.5rem", width: "2.5rem" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
