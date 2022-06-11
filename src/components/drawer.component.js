import NextLink from "next/link";
import { useRouter } from "next/router";

import { Drawer as MuiDrawer, Grid } from "@mui/material";

import { Button, IconButton, CloseIcon, ProfileIcon } from "@/src/components";

import { http } from "@/src/utils";

// TODO: Icons are broken for some reason

const LINK_METADATA = {
  browse: {
    Icon: ProfileIcon,
    label: "Browse Series",
  },
  login: {
    Icon: ProfileIcon,
    label: "Login",
  },
  register: {
    Icon: ProfileIcon,
    label: "Register",
  },
  account: {
    Icon: ProfileIcon,
    label: "My Account",
  },
  logout: {
    Icon: ProfileIcon,
    label: "Log Out",
  },
  faq: {
    Icon: ProfileIcon,
    label: "FAQ",
  },
};

const SidebarItem = ({ label, Icon, onClick }) => (
  <Button
    onClick={onClick}
    style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    }}
  >
    {label}
    <ProfileIcon sx={{ height: "2rem", width: "2rem", marginLeft: "1rem" }} />
  </Button>
);

const Drawer = ({ user, clearUser, drawerIsOpen, toggleDrawer }) => {
  const router = useRouter();

  const logout = async () => {
    const { ok } = await http("/auth/logout");
    if (ok) {
      clearUser();
      router.push("/");
    }
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
        <IconButton onClick={toggleDrawer}>
          <CloseIcon sx={{ height: "2rem", width: "2rem" }}>Close</CloseIcon>
        </IconButton>

        <NextLink href="/series" passHref>
          <SidebarItem {...LINK_METADATA.browse} onClick={toggleDrawer} />
        </NextLink>
        {!!user ? (
          <>
            <NextLink href="/account" passHref>
              <SidebarItem {...LINK_METADATA.account} onClick={toggleDrawer} />
            </NextLink>
            <SidebarItem {...LINK_METADATA.logout} onClick={logout} />
          </>
        ) : (
          <>
            <NextLink href="/login" passHref>
              <SidebarItem {...LINK_METADATA.login} onClick={toggleDrawer} />
            </NextLink>
            <NextLink href="/register" passHref>
              <SidebarItem {...LINK_METADATA.register} onClick={toggleDrawer} />
            </NextLink>
          </>
        )}
        <NextLink href="/faq" passHref>
          <SidebarItem {...LINK_METADATA.faq} onClick={toggleDrawer} />
        </NextLink>
      </Grid>
    </MuiDrawer>
  );
};

export default Drawer;
