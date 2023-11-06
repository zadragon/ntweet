import React from "react";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";
const logOut = () => {
  auth.signOut();
  <Navigate to="/" />;
};
const Home = () => {
  return (
    <h1>
      <button onClick={logOut}>Log out</button>
    </h1>
  );
};

export default Home;
