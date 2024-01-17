import * as React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import EditIcon from "@mui/icons-material/Edit";
import useSecrets from "../hooks/useSecrets";
import Spinner from "./Spinner";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const ListItemBox = styled(ListItem)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(1, 0),
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
}));

// Add a new IconButton for updating secrets
const UpdateIconButton = styled(IconButton)(({ theme }) => ({
  marginLeft: "auto",
  color: theme.palette.text.secondary,
}));

// Add a new Typography for the update button label
const UpdateLabel = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontSize: theme.typography.caption.fontSize,
}));

const Count = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(2),
  fontSize: theme.typography.caption.fontSize,
  color: theme.palette.text.secondary,
}));

function generate(element, index) {
  return React.cloneElement(element, {
    key: index,
  });
}

export default function SecretePost() {
  const {
    secrets,
    inputValue,
    isLoggedIn,
    loading,
    userId,
    setInputValue,
    handleCreateSecret,
    handleDeleteSecret,
    handleUpdateSecret,
  } = useSecrets();

  const changeHandler = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCreateSecret();
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, maxWidth: 752, margin: "auto" }}>
        <Typography mt={4} mb={2} variant="h6" component="div">
          Anonymous Posts
        </Typography>

        {loading ? (
          <Spinner />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              {secrets &&
                secrets.map((item, index) => (
                  <Demo key={item._id}>
                    <List>
                      {generate(
                        <ListItemBox>
                          <Count>{index + 1}</Count>
                          <ListItemText primary={item.content} />
                          {item.user_id === userId && (
                            <>
                              <UpdateIconButton
                                onClick={() => {
                                  const updatedContent = prompt(
                                    "Enter updated content:"
                                  );
                                  if (updatedContent !== null) {
                                    handleUpdateSecret(
                                      item._id,
                                      updatedContent
                                    );
                                  }
                                }}
                                edge="end"
                                aria-label="update"
                              >
                                <EditIcon />
                              </UpdateIconButton>
                              <IconButton
                                onClick={() => handleDeleteSecret(item._id)}
                                edge="end"
                                aria-label="delete"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </ListItemBox>,
                        index
                      )}
                    </List>
                  </Demo>
                ))}
            </Grid>
          </Grid>
        )}

        {isLoggedIn && (
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              "& .MuiTextField-root": { mb: 2, width: "100%" },
            }}
            autoComplete="off"
          >
            <TextField
              id="outlined-multiline-static"
              label="Write Your Secret"
              multiline
              name="content"
              rows={4}
              value={inputValue}
              onChange={changeHandler}
            />

            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
              Create Secret
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
}
