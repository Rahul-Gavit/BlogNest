const express = require("express");
const {
  getAllBlogController,
  createBlogController,
  updateBlogController,
  getBlogByIdController,
  deleteBlogController,
  userBlogController,
} = require("../controllers/blogController");
const jwtMiddleware = require("../middlewares");

const router = express.Router();

//GET || all blog
router.get("/all-blog", getAllBlogController);

//POST || create blog
router.post("/create-blog", jwtMiddleware, createBlogController);

//PUT || update blog
router.put("/update-blog/:id", jwtMiddleware, updateBlogController);

//GET || delete blog
router.delete("/delete-blog/:id", jwtMiddleware, deleteBlogController);

//GET || single blog details
router.get("/get-blog/:id", jwtMiddleware, getBlogByIdController);

//GET || user blog
router.get("/user-blog/:id", userBlogController);

module.exports = router;
