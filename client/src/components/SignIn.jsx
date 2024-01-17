import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "./Spinner"; // Import your Spinner component

const defaultTheme = createTheme();
const API_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}api/v1/user/login`;

export default function SignIn() {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = React.useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = React.useState(false);

  const handleInputChange = ({ target }) => {
    const { name, value } = target;

    setInputValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isEmailValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputValue.email);
  };

  const isPasswordValid = () => {
    return inputValue.password.trim() !== "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEmailValid()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!isPasswordValid()) {
      toast.error("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINT, inputValue);

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem("jwtToken", token);
        console.log("Login successfully");
        toast.success("Login successful.");
        navigate("/");
      } else {
        console.error("Failed to submit form data");
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={inputValue.email}
                  onChange={handleInputChange}
                  error={!isEmailValid()}
                  helperText={isEmailValid() ? "" : "Invalid email format"}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={inputValue.password}
                  onChange={handleInputChange}
                  error={!isPasswordValid()}
                  helperText={
                    isPasswordValid() ? "" : "Password cannot be empty"
                  }
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      )}
    </>
  );
}
