import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const useBlogPost = () => {
  const [BlogPost, setBlogPost] = useState([]);
  const [inputValue, setInputValue] = useState({ title: "", content: "" });
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}api/v1/blog/all-blog`
      );
      setBlogPost(response.data.blog);
      console.log(response.data.blog);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePost = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("jwtToken");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/v1/blog/create-blog`,
        { title: inputValue.title, content: inputValue.content },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("Blog created successfully");
        setBlogPost((prevBlogPost) => [...prevBlogPost, response.data.blog]);
        fetchData();
      } else {
        console.log("Fail to create secret");
      }
    } catch (error) {
      console.error("Error during create secret:", error);
      toast.error("Secret creation failed");
    } finally {
      setLoading(false);
      setInputValue({ title: "", content: "" });
    }
  };

  const handleDeletePost = async (blogId) => {
    try {
      const token = localStorage.getItem("jwtToken");

      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}api/v1/blog/delete-blog/${blogId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Blog deleted successfully");
        setBlogPost((prevBlogPost) =>
          prevBlogPost.filter((item) => item._id !== blogId)
        );
      } else {
        console.log("Fail to delete blog");
      }
    } catch (error) {
      console.error("Error during delete blog:", error);
      toast.error("Blog deletion failed");
    }
  };

  const handleUpdatePost = async (blogId, updatedContent) => {
    try {
      const token = localStorage.getItem("jwtToken");

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}api/v1/blog/update-blog/${blogId}`,
        { content: updatedContent },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Blog updated successfully");
        setBlogPost((prevBlogPost) =>
          prevBlogPost.map((item) =>
            item._id === blogId ? { ...item, content: updatedContent } : item
          )
        );
      } else {
        console.log("Fail to update blog");
      }
    } catch (error) {
      console.error("Error during update blog:", error);
      toast.error("Blog update failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setLoggedIn(false);
    setUserId("");
  };

  return {
    BlogPost,
    inputValue,
    isLoggedIn,
    loading,
    userId,
    setInputValue,
    handleCreatePost,
    handleDeletePost,
    handleUpdatePost,
    logout,
  };
};

export default useBlogPost;
