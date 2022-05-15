import { useState } from "react";
import Head from "next/head";
import { Navbar, Footer, Drawer } from ".";

const Layout = ({ user, children }) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const toggleDrawer = () => setDrawerIsOpen(!drawerIsOpen);
  return (
    <>
      <Head>
        <title>FunctionalPlayer</title>
      </Head>
      <Drawer
        user={user}
        drawerIsOpen={drawerIsOpen}
        toggleDrawer={toggleDrawer}
      />
      <Navbar user={user} toggleDrawer={toggleDrawer} />
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
