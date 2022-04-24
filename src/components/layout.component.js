import { Navbar, Footer } from "src/components";

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ margin: "2rem 0" }}>{children}</main>
    <Footer />
  </>
);

export default Layout;
