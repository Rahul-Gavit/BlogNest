import * as React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import useBlogPost from "../hooks/useBlogPost";
import Spinner from "./Spinner";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function BlogPostPost() {
  const [expandedPosts, setExpandedPosts] = React.useState([]);

  const handleExpansion = (index) => {
    setExpandedPosts((prevExpandedPosts) => {
      const newExpandedPosts = [...prevExpandedPosts];
      newExpandedPosts[index] = !newExpandedPosts[index];

      return newExpandedPosts;
    });
  };

  const {
    BlogPost,
    inputValue,
    isLoggedIn,
    loading,
    userId,
    setInputValue,
    handleCreatePost,
    handleDeletePost,
    handleUpdatePost,
  } = useBlogPost();

  const changeHandler = (event) => {
    const { name, value } = event.target;

    setInputValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCreatePost();
  };

  return (
    <>
      <Box
        sx={{ flexGrow: 1, maxWidth: 752, margin: "auto", marginTop: "12px" }}
      >
        {loading ? (
          <Spinner />
        ) : (
          BlogPost &&
          BlogPost.map((item, index) => (
            <Accordion
              key={item._id}
              expanded={expandedPosts[index] || false}
              onChange={() => handleExpansion(index)}
              sx={{
                "& .MuiAccordion-region": {
                  height: expandedPosts[index] ? "auto" : 0,
                },
                "& .MuiAccordionDetails-root": {
                  display: expandedPosts[index] ? "block" : "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{ marginTop: "12px" }}
              >
                <Typography
                  sx={{
                    typography: "subtitle2",
                    fontSize: "16px",
                  }}
                >
                  {item.title}
                </Typography>
              </AccordionSummary>
              <Typography sx={{ marginLeft: "12px", typography: "subtitle2" }}>
                @{item.user_id.username}
              </Typography>
              <AccordionDetails>
                <Typography>{item.content}</Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  {item.user_id._id === userId && (
                    <>
                      <IconButton
                        onClick={() => {
                          const updatedContent = prompt(
                            "Enter updated content:"
                          );
                          if (updatedContent !== null) {
                            handleUpdatePost(item._id, updatedContent);
                          }
                        }}
                        edge="end"
                        aria-label="update"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeletePost(item._id)}
                        edge="end"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
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
              id="outlined-basic"
              label="Title"
              name="title"
              variant="outlined"
              value={inputValue.title}
              onChange={changeHandler}
            />
            <TextField
              id="outlined-multiline-static"
              label="Write Your Blog"
              multiline
              name="content"
              rows={4}
              value={inputValue.content}
              onChange={changeHandler}
            />

            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
              Create Blog
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
}
