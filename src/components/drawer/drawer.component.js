import { useContext } from "react";
import { useRouter } from "next/router";
import { DEFAULT_ERROR_MESSAGE } from "@/src/utils";

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

  const logout = async () => {
    try {
      const { error, resUser } = await http("/auth/logout", {
        email: user.email,
      });

      if (!!error) {
        updateCtx({
          toastData: {
            message: error.message,
            severity: "error",
          },
        });
      } else if (resUser === null) {
        updateCtx({ user: resUser });
        router.push("/login");
      }
    } catch (e) {
      updateCtx({
        toastData: {
          message: DEFAULT_ERROR_MESSAGE,
          severity: "error",
        },
      });
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
          minWidth: "15rem",
          display: "flex",
          alignItems: "flex-start",
          backgroundColor: "background.paper",
          backgroundImage: "none",
          boxShadow: "none",
        },
      }}
      data-testid="drawer"
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        gap={4}
        sx={{ height: "100%" }}
      >
        <SidebarItem
          Icon={ProfileIcon}
          label="Home"
          href={!user ? "/" : "/dashboard"}
          isSelected={router.pathname === "/dashboard"}
          onClick={toggleDrawer}
        />
        <SidebarItem
          Icon={ProfileIcon}
          label="Browse series"
          href="/series"
          isSelected={router.pathname === "/series"}
          onClick={toggleDrawer}
        />
        {!!user ? (
          <>
            <SidebarItem
              Icon={ProfileIcon}
              label="My List"
              href="/list"
              isSelected={router.pathname === "/list"}
              onClick={toggleDrawer}
            />
            <SidebarItem
              Icon={ProfileIcon}
              label="My Account"
              href="/account"
              isSelected={router.pathname === "/account"}
              onClick={toggleDrawer}
            />
            <SidebarItem
              Icon={ProfileIcon}
              label="Logout"
              onClick={() => {
                logout();
                toggleDrawer();
              }}
            />
          </>
        ) : (
          <>
            <SidebarItem
              Icon={ProfileIcon}
              label="Login"
              href="/login"
              isSelected={router.pathname === "/login"}
              onClick={toggleDrawer}
            />
            <SidebarItem
              Icon={ProfileIcon}
              label="Register"
              href="/register"
              isSelected={router.pathname === "/register"}
              onClick={toggleDrawer}
            />
          </>
        )}
        <SidebarItem
          Icon={ProfileIcon}
          label="FAQ"
          href="/faq"
          isSelected={router.pathname === "/faq"}
          onClick={toggleDrawer}
        />
      </Grid>
    </MuiDrawer>
  );
};

export default Drawer;
