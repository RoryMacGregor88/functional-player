import NextLink from "next/link";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { MenuIcon } from "@/src/components";

import { IconButton } from ".";

/**
 * @param {{
 *  user?: object,
 *  drawerIsOpen: boolean,
 *  toggleDrawer: function
 * }} props
 */
const Navbar = ({ user, drawerIsOpen, toggleDrawer }) => {
  const options = {
    visibility: drawerIsOpen ? "hidden" : "visible",
  };

  return (
    <AppBar
      position="static"
      sx={{
        border: "none",
        borderBottomColor: "palette.primary.main",
        borderBottomStyle: "solid",
        borderBottomWidth: "1px",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
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
