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
    },
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
    const { error, ok, user } = await http("/auth/logout");
    if (error) {
      updateCtx({
        toastData: {
          message: DEFAULT_ERROR_MESSAGE,
          severity: "error",
        },
      });
    } else if (ok) {
      updateCtx({ user });
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
