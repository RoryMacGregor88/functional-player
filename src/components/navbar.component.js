import { useRouter } from "next/router";
import { AppBar, Toolbar, Typography, Grid } from "@mui/material";
import { MenuIcon, IconButton, Link } from "@/src/components";

/**
 * @param {{
 *  user: object|null,
 *  toggleDrawer: function
 * }} props
 */
const Navbar = ({ user, toggleDrawer }) => {
  const router = useRouter();
  const LINK_METADATA = [
    {
      label: "Home",
      href: !user ? "/" : "/dashboard",
      isSelected: router.pathname === "/dashboard",
    },
    {
      label: "Browse Series",
      href: "/series",
      isSelected: router.pathname === "/series",
    },
    {
      label: "My Account",
      href: "/account",
      isSelected: router.pathname === "/account",
    },
    {
      label: "My List",
      href: "/bookmarks",
      isSelected: router.pathname === "/bookmarks",
    },
  ];

  // TODO: clicking logo does not close drawer

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 2000,
        border: "none",
        backgroundColor: "background.paper",
        boxShadow: "none",
        backgroundImage: "none",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "0.5rem",
          minHeight: "fit-content !important",
        }}
      >
        <IconButton
          aria-label="menu"
          onClick={toggleDrawer}
          sx={{
            padding: "0",
            margin: 0,
          }}
        >
          <MenuIcon
            sx={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
          />
        </IconButton>
        <Link href={!!user ? "/dashboard" : "/"} passHref>
          <Typography variant="h5" sx={{ cursor: "pointer" }}>
            Functional Player
          </Typography>
        </Link>
        <Grid
          container
          alignItems="center"
          gap={2}
          sx={{ marginLeft: "auto", width: "fit-content" }}
        >
          {LINK_METADATA.map(({ label, href, isSelected }) => (
            <Link key={label} href={href} passHref>
              <span
                style={{
                  cursor: "pointer",
                  borderBottom: isSelected
                    ? "2px solid orange"
                    : "2px solid transparent",
                  width: "fit-content",
                  marginLeft: "0.5rem",
                }}
              >
                {label}
              </span>
            </Link>
          ))}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
