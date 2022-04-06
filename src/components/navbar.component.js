import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Typography,
  Container,
} from "@mui/material";

const PAGES = ["Page 1", "Page 2", "Page 3"],
  OPTIONS = ["Settings", "Account", "Logout"];

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOptionClick = () => {
    setAnchorEl(null);
  };

  const handleButtonClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar disableGutters>
        <Typography variant="h4">Functional Player</Typography>
        {PAGES.map((page) => (
          <button key={page} onClick={() => console.log("clicked")}>
            {page}
          </button>
        ))}
        <div>
          <button onClick={handleButtonClick}>Open Nav</button>
          <Menu
            id="appbar-menu"
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleClose}
          >
            {OPTIONS.map((option) => (
              <MenuItem key={option} onClick={handleOptionClick}>
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
