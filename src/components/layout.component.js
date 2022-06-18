import { useState } from "react";

import Head from "next/head";

import { Navbar, Footer, Drawer } from "@/src/components";

const Layout = ({ user, clearUser, children }) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const toggleDrawer = () => setDrawerIsOpen(!drawerIsOpen);
  return (
    <>
      <Head>
        <title>FunctionalPlayer</title>
      </Head>
      <Drawer
        user={user}
        clearUser={clearUser}
        drawerIsOpen={drawerIsOpen}
        toggleDrawer={toggleDrawer}
      />
      <Navbar
        user={user}
        drawerIsOpen={drawerIsOpen}
        toggleDrawer={toggleDrawer}
      />
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          minHeight: "85vh",
        }}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
