import { Close as CloseIcon } from "@mui/icons-material";
import { Drawer as MuiDrawer, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { logoutHandler } from "src/utils";
import NextLink from "next/link";

import { Button, IconButton } from "src/components";

const Drawer = ({ user, drawerIsOpen, toggleDrawer }) => {
  const router = useRouter();

  const logout = () => {
    logoutHandler();
    return router.push("/");
  };

  return (
    <MuiDrawer
      anchor="right"
      open={drawerIsOpen}
      onClose={toggleDrawer}
      sx={{
        ".MuiDrawer-paper": {
          padding: "1rem",
          minWidth: "15%",
          display: "flex",
          alignItems: "flex-start",
        },
      }}
    >
      <Grid container direction="column" justifyContent="space-between">
        <IconButton>
          <CloseIcon
            onClick={toggleDrawer}
            sx={{ height: "2rem", width: "2rem" }}
          >
            Close
          </CloseIcon>
        </IconButton>

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
            <NextLink href="/login" passHref>
              <Button onClick={toggleDrawer}>Login</Button>
            </NextLink>
            <NextLink href="/register" passHref>
              <Button onClick={toggleDrawer}>Sign Up</Button>
            </NextLink>
          </>
        )}
        <NextLink href="/faq" passHref>
          <Button onClick={toggleDrawer}>FAQ</Button>
        </NextLink>
      </Grid>
    </MuiDrawer>
  );
};

export default Drawer;
