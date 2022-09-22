import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../components/Auth";

const HomePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));
  useEffect(() => {
    if (user) navigate("/chats");
  }, [user, navigate]);

  return (
    <div>
      <Auth />
    </div>
  );
};

export default HomePage;
