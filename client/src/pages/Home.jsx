import React from "react";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import SecretePost from "../components/SecretePost";
import NavBar from "../components/NavBar";

const Home = () => {
  return (
    <div>
      <NavBar />
      <SecretePost />
    </div>
  );
};

export default Home;
