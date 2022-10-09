import { useContext } from "react";
import { useRouter } from "next/router";

import { Drawer as MuiDrawer, Grid } from "@mui/material";

import { SidebarItem, ProfileIcon, BookmarksIcon } from "@/src/components";

import { http, Context } from "@/src/utils";

/**
 * @param {{
 *  user: object,
 *  drawerIsOpen: boolean,
 *  toggleDrawer: function
 * }} props
 */
const Drawer = ({ user, drawerIsOpen, toggleDrawer }) => {
  const router = useRouter();
  const { updateCtx } = useContext(Context);

  const LINK_METADATA = {
    home: {
      Icon: ProfileIcon,
      label: "Home",
      href: !user ? "/" : "/dashboard",
      isSelected: router.pathname === "/dashboard",
    },
    browse: {
      Icon: ProfileIcon,
      label: "Browse Series",
      href: "/series",
      isSelected: router.pathname === "/series",
    },
    login: {
      Icon: ProfileIcon,
      label: "Login",
      href: "/login",
      isSelected: router.pathname === "/login",
    },
    register: {
      Icon: ProfileIcon,
      label: "Register",
      href: "/register",
      isSelected: router.pathname === "/register",
    },
    account: {
      Icon: ProfileIcon,
      label: "My Account",
      href: "/account",
      isSelected: router.pathname === "/account",
    },
    bookmarks: {
      Icon: BookmarksIcon,
      label: "My List",
      href: "/bookmarks",
      isSelected: router.pathname === "/bookmarks",
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
    const {
      error,
      ok,
      user: resUser,
    } = await http("/auth/logout", { email: user.email });
    if (error) {
      updateCtx({
        toastData: {
          message: error,
          severity: "error",
        },
      });
    } else if (ok) {
      updateCtx({ user: resUser });
      router.push("/login");
    }
  };

  return (
    <MuiDrawer
      anchor="left"
      open={drawerIsOpen}
      onClose={toggleDrawer}
      sx={{
        ".MuiDrawer-paper": {
          padding: "1rem",
          minWidth: "12.5%",
          display: "flex",
          alignItems: "flex-start",
          backgroundColor: "background.paper",
          backgroundImage: "none",
          boxShadow: "none",
        },
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        gap={5}
        sx={{ height: "100%" }}
      >
        <SidebarItem {...LINK_METADATA.home} onClick={toggleDrawer} />
        <SidebarItem {...LINK_METADATA.browse} onClick={toggleDrawer} />
        {!!user ? (
          <>
            <SidebarItem {...LINK_METADATA.bookmarks} onClick={toggleDrawer} />
            <SidebarItem {...LINK_METADATA.account} onClick={toggleDrawer} />
            <SidebarItem
              {...LINK_METADATA.logout}
              onClick={() => {
                logout();
                toggleDrawer();
              }}
            />
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
