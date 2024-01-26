const Blog = require("../model/Blog");
const User = require("../model/User");

// GET all blogs
exports.getAllBlogController = async (req, res) => {
  try {
    const blog = await Blog.find({}).populate("user_id");

    if (blog.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No blog posts found",
      });
    }

    return res.status(200).json({
      success: true,
      blogCount: blog.length,
      message: "All blog posts",
      blog,
    });
  } catch (error) {
    console.error("Error while getting blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Error while getting blogs",
      error: error.message,
    });
  }
};

// Create Blog
exports.createBlogController = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title && !content) {
      return res.status(400).send({
        success: false,
        message: "Please enter all field",
      });
    }

    const userId = req.userId;
    const existingUser = await User.findOne({ _id: userId });

    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "Unable to find user",
      });
    }

    const newBlog = new Blog({
      user_id: userId,
      title,
      content,
      timestamp: new Date(),
    });

    const blog = await newBlog.save();
    existingUser.blogs.push(newBlog);
    await existingUser.save();

    return res.status(201).send({
      success: true,
      message: "blog created",
      blog,
    });
  } catch (error) {
    console.error("Error while creating blog:", error);
    return res.status(400).json({
      success: false,
      message: "Error while creating blog",
      error: error.message,
    });
  }
};

// Update Blog
exports.updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Blog updated",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error while updating blog:", error);
    return res.status(400).json({
      success: false,
      message: "Error while updating blog",
      error: error.message,
    });
  }
};

// Delete Blog
exports.deleteBlogController = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const blog = await Blog.findOneAndDelete({
      _id: id,
      user_id: userId,
    }).populate("user_id");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found or you do not have the authority to delete it",
      });
    }

    const user = blog.user_id;
    user.blogs.pull(blog);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting blog:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting blog",
      error: error.message,
    });
  }
};

// Single Blog
exports.getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "blog not found for that id",
      });
    }
    return res.status(200).send({
      success: true,
      message: "fetch single blog",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while getting blogs",
      error,
    });
  }
};

// GET User Blog
exports.userBlogController = async (req, res) => {
  try {
    const userBlog = await User.findById(req.params.id).populate("blogs");
    if (!userBlog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found with this id",
      });
    }
    return res.status(200).send({
      success: true,
      message: "user blogs",
      userBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in user blog",
      error,
    });
  }
};
