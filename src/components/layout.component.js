import { useState } from "react";

import Head from "next/head";

import { Navbar, Footer, Drawer } from "@/src/components";

/**
 * @param {{
 *  user: object,
 *  fetchToken: function,
 *  children: React.ReactChildren
 * }} props
 */
const Layout = ({ user, fetchToken, children }) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const toggleDrawer = () => setDrawerIsOpen(!drawerIsOpen);
  return (
    <>
      <Head>
        <title>FunctionalPlayer</title>
      </Head>
      <Drawer
        user={user}
        fetchToken={fetchToken}
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
