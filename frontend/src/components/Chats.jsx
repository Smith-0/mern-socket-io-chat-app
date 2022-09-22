import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatListItem from "./ChatListItem";
import Navbar from "./Navbar";
import ProfileModal from "./ProfileModal";

import { fetchChat } from "../actions/chatAction";

const Chats = ({
  setIsChatOpen,
  notification,
  setNotification,
  allNotification,
  setAllNotification,
  isOpen,
  onOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { chats } = useSelector((state) => state.chats);

  const currentUser = JSON.parse(localStorage.getItem("userData"))?.user;

  useEffect(() => {
    dispatch(fetchChat());
  }, []);

  const sortedChat = chats?.sort((a, b) => a.createdAt - b.createdAt);

  return (
    <>
      <Navbar />
      {sortedChat?.map((chat) => (
        <ChatListItem
          key={chat?._id}
          chat={chat}
          setIsChatOpen={setIsChatOpen}
          notification={notification}
          setNotification={setNotification}
          allNotification={allNotification}
          setAllNotification={setAllNotification}
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
        />
      ))}
    </>
  );
};

export default Chats;
