import { AppBar, Toolbar, Typography } from "@mui/material";

const PAGES = ["Page 1", "Page 2", "Page 3"];

const Navbar = ({ user }) => {
  return (
    <AppBar position="static">
      <Toolbar disableGutters>
        <Typography variant="h4">Functional Player</Typography>
        {PAGES.map((page) => (
          <button key={page} onClick={() => console.log("clicked")}>
            {page}
          </button>
        ))}
        {!!user ? <Typography variant="h4">{user.username}</Typography> : null}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
