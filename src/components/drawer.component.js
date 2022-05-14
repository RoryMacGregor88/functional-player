import { Close as CloseIcon } from "@mui/icons-material";
import { Drawer as MuiDrawer, Grid, Button, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { logoutHandler } from "src/utils";
import NextLink from "next/link";

const Drawer = ({ user, drawerIsOpen, toggleDrawer }) => {
  const router = useRouter();

  const logout = () => {
    logoutHandler();
    return router.push("/");
  };

  const containerStyles = {
      "& > *": {
        marginBottom: "1rem",
        width: "fit-content",
      },
    },
    iconStyles = {
      color: "#fff",
      cursor: "pointer",
      "&:hover": {
        color: "#fff",
      },
    };

  return (
    <MuiDrawer anchor="right" open={drawerIsOpen} onClose={toggleDrawer}>
      <Grid container wrap="nowrap">
        <Grid
          item
          container
          direction="column"
          justifyContent="space-between"
          sx={containerStyles}
        >
          <NextLink href="/series" passHref>
            <Button onClick={toggleDrawer}>Browse Series</Button>
          </NextLink>
          {!!user ? (
            <>
              <NextLink href="/account" passHref>
                <Button toggleDrawer={toggleDrawer}>My Account</Button>
              </NextLink>
              <Button onClick={logout}>Log Out</Button>
            </>
          ) : (
            <>
              <NextLink href="/register" passHref>
                <Button onClick={toggleDrawer}>Sign Up</Button>
              </NextLink>
              <NextLink href="/login" passHref>
                <Button onClick={toggleDrawer}>Login</Button>
              </NextLink>
            </>
          )}
        </Grid>
        <Grid item component={IconButton}>
          <CloseIcon onClick={toggleDrawer} sx={iconStyles}>
            Close
          </CloseIcon>
        </Grid>
      </Grid>
    </MuiDrawer>
  );
};

export default Drawer;
