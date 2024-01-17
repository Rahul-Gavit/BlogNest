import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const useSecrets = () => {
  const [secrets, setSecrets] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}api/v1/secrete/all-secrete`
        );
        setSecrets(response.data.secret);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCreateSecret = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("jwtToken");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/secrete/create-secrete`,
        { content: inputValue },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("Secret created successfully");
        setSecrets((prevSecrets) => [...prevSecrets, response.data.secrete]);
      } else {
        console.log("Fail to create secret");
      }
    } catch (error) {
      console.error("Error during create secret:", error);
      toast.error("Secret creation failed");
    } finally {
      setLoading(false);
      setInputValue("");
    }
  };

  const handleDeleteSecret = async (secretId) => {
    try {
      const token = localStorage.getItem("jwtToken");

      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/v1/secrete/delete-secrete/${secretId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Secret deleted successfully");
        setSecrets((prevSecrets) =>
          prevSecrets.filter((item) => item._id !== secretId)
        );
      } else {
        console.log("Fail to delete secret");
      }
    } catch (error) {
      console.error("Error during delete secret:", error);
      toast.error("Secret deletion failed");
    }
  };

  const handleUpdateSecret = async (secretId, updatedContent) => {
    try {
      const token = localStorage.getItem("jwtToken");

      const response = await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/v1/secrete/update-secrete/${secretId}`,
        { content: updatedContent },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Secret updated successfully");
        setSecrets((prevSecrets) =>
          prevSecrets.map((item) =>
            item._id === secretId ? { ...item, content: updatedContent } : item
          )
        );
      } else {
        console.log("Fail to update secret");
      }
    } catch (error) {
      console.error("Error during update secret:", error);
      toast.error("Secret update failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setLoggedIn(false);
    setUserId("");
  };

  return {
    secrets,
    inputValue,
    isLoggedIn,
    loading,
    userId,
    setInputValue,
    handleCreateSecret,
    handleDeleteSecret,
    handleUpdateSecret,
    logout,
  };
};

export default useSecrets;
