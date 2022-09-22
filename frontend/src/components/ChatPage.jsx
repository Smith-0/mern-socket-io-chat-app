import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Chats from "./Chats";
import Conversation from "./Conversation";

const ChatPage = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const navigate = useNavigate();
  const { selectedChat } = useSelector((state) => state.chats);
  const user = JSON.parse(localStorage.getItem("userData"));
  const [notification, setNotification] = useState(null);
  const [allNotification, setAllNotification] = useState([]);
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const below768 = window.matchMedia("(max-width: 768px)");
  const above768 = window.matchMedia("(min-width: 768px)");

  useEffect(() => {
    let conversationSection = document.querySelector("#conversation");
    let chatsSection = document.querySelector("#chats");
    if (below768.matches) {
      if (selectedChat) {
        chatsSection.style.display = "none";
        conversationSection.style.display = "block";
      } else {
        chatsSection.style.display = "block";
        conversationSection.style.display = "none";
      }
    } else if (above768.matches) {
      console.log("matches");
      chatsSection.style.display = "block";
      conversationSection.style.display = "block";
    }
  }, [width, selectedChat]);

  return (
    <>
      <div className="grid grid-cols-12 gap-0">
        <div
          id="chats"
          className="col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-4 border-r-[0.3px] h-screen"
        >
          <Chats
            notification={notification}
            setNotification={setNotification}
            allNotification={allNotification}
            setAllNotification={setAllNotification}
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
          />
        </div>
        <div
          id="conversation"
          className="col-span-12 md:col-span-6 lg:col-span-7 xl:col-span-8 conversation h-screen relative"
        >
          <Conversation
            notification={notification}
            setNotification={setNotification}
            allNotification={allNotification}
            setAllNotification={setAllNotification}
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
          />
        </div>
      </div>
    </>
  );
};

export default ChatPage;
