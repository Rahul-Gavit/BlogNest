import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import useBlogPost from "../hooks/useBlogPost";

export default function NavBar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useBlogPost();

  const handleLogout = () => {
    logout();
    window.location.reload();
    navigate("/");
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BlogNest
          </Typography>

          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              LogOut
            </Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/signup")}>
                SignUp
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
