import NextLink from "next/link";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { MenuIcon } from "@/src/components";

import { IconButton } from ".";

//TODO: what does passHref do?

const Navbar = ({ user, toggleDrawer }) => (
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
      {!!user ? (
        <Typography variant="h4"> Signed in as: {user.username}</Typography>
      ) : null}
      <IconButton aria-label="menu" onClick={toggleDrawer}>
        <MenuIcon sx={{ height: "2.5rem", width: "2.5rem" }} />
      </IconButton>
    </Toolbar>
  </AppBar>
);

export default Navbar;
