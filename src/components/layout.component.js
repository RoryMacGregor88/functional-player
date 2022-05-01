import { Navbar, Footer } from "src/components";

const Layout = ({ user, children }) => (
  <>
    <Navbar user={user} />
    <main style={{ margin: "2rem 0" }}>{children}</main>
    <Footer />
  </>
);

export default Layout;
