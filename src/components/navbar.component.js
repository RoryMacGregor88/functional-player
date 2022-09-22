import { AppBar, Toolbar, Typography } from "@mui/material";

import { MenuIcon, IconButton, Link } from "@/src/components";

/**
 * @param {{
 *  user?: object,
 *  drawerIsOpen: boolean,
 *  toggleDrawer: function
 * }} props
 */
const Navbar = ({ user, drawerIsOpen, toggleDrawer }) => {
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
          alignItems: "center",
          padding: "1rem",
          minHeight: "fit-content !important",
        }}
      >
        <IconButton
          aria-label="menu"
          onClick={toggleDrawer}
          sx={{
            padding: "0",
            visibility: drawerIsOpen ? "hidden" : "visible",
            margin: 0,
          }}
        >
          <MenuIcon
            sx={{ height: "2.5rem", width: "2.5rem", marginRight: "1rem" }}
          />
        </IconButton>
        <Link href={!!user ? "/dashboard" : "/"} passHref>
          <Typography variant="h4" sx={{ cursor: "pointer" }}>
            Functional Player
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
