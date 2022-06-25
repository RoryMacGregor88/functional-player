import { useRouter } from "next/router";

import { Drawer as MuiDrawer, Grid } from "@mui/material";

import {
  IconButton,
  CloseIcon,
  SidebarItem,
  ProfileIcon,
  BookmarksIcon,
} from "@/src/components";

import { http } from "@/src/utils";

/** @param {{user: object}} props */
const Drawer = ({ user, clearUser, drawerIsOpen, toggleDrawer }) => {
  const router = useRouter();

  const LINK_METADATA = {
    browse: {
      Icon: ProfileIcon,
      label: "Browse Series",
      href: "/series",
    },
    login: {
      Icon: ProfileIcon,
      label: "Login",
      href: "/login",
    },
    register: {
      Icon: ProfileIcon,
      label: "Register",
      href: "/register",
    },
    account: {
      Icon: ProfileIcon,
      label: "My Account",
      href: "/account",
    },
    bookmarks: {
      Icon: BookmarksIcon,
      label: "Bookmarks",
      href: "/bookmarks",
    },
    logout: {
      Icon: ProfileIcon,
      label: "Log Out",
    },
    faq: {
      Icon: ProfileIcon,
      label: "FAQ",
      href: "/faq",
    },
  };

  const logout = async () => {
    const { ok } = await http("/auth/logout");
    if (ok) {
      // TODO: why is this required? Navigating to landing page should wipe local state and re-run useEffect, returning noSession because session was destroyed.
      // clearUser();
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
          backgroundColor: "transparent",
          backgroundImage: "none",
          boxShadow: "none",
        },
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <IconButton onClick={toggleDrawer}>
          <CloseIcon sx={{ height: "2rem", width: "2rem" }}>Close</CloseIcon>
        </IconButton>

        <SidebarItem {...LINK_METADATA.browse} onClick={toggleDrawer} />
        {!!user ? (
          <>
            <SidebarItem {...LINK_METADATA.bookmarks} onClick={toggleDrawer} />
            <SidebarItem {...LINK_METADATA.account} onClick={toggleDrawer} />
            <SidebarItem {...LINK_METADATA.logout} onClick={logout} />
          </>
        ) : (
          <>
            <SidebarItem {...LINK_METADATA.login} onClick={toggleDrawer} />
            <SidebarItem {...LINK_METADATA.register} onClick={toggleDrawer} />
          </>
        )}
        <SidebarItem {...LINK_METADATA.faq} onClick={toggleDrawer} />
      </Grid>
    </MuiDrawer>
  );
};

export default Drawer;
