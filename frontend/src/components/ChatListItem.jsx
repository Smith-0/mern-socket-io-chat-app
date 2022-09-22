import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@chakra-ui/react";

const ChatListItem = ({ chat, setIsChatOpen, setAllNotification }) => {
  const dispatch = useDispatch();

  const currentUser = JSON.parse(localStorage.getItem("userData")).user;
  const { users, isGroupChat, chatName } = chat;

  const { messages } = useSelector((state) => state.messages);

  const chatWithUser = users.filter((user) => user._id !== currentUser._id)[0];

  let allNotifications =
    JSON.parse(localStorage.getItem("allNotification")) || [];
  let noOfNotificationInThisChat = allNotifications?.filter(
    (notification) => notification.chatId === chat._id
  ).length;
  const handleClick = () => {
    dispatch({ type: "SELECT_CHAT", id: chat._id });

    setAllNotification(
      allNotifications.filter(
        (notification) => notification.chatId !== chat._id
      )
    );

    localStorage.setItem(
      "allNotification",
      JSON.stringify(
        allNotifications.filter(
          (notification) => notification.chatId !== chat._id
        )
      )
    );

    if (setIsChatOpen) setIsChatOpen(true);
  };

  return (
    <>
      {chat && (
        <div
          onClick={handleClick}
          className="hover:bg-gray-50 flex flex-row justify-start items-center px-[1.3rem] cursor-pointer"
        >
          <Avatar
            bg="gray.300"
            name={chatWithUser.name}
            src={chatWithUser.picture}
          />
          <div className="relative ml-3 pl-5 border-y-[0.2px] border-gray-200 py-3 flex-1">
            <div className="name font-semibold text-lg">
              {isGroupChat ? chatName : chatWithUser.name}
            </div>
            <div className="status text-sm text-gray-500">
              {chat.latestMessage &&
                currentUser._id === chat.latestMessage.sender._id && (
                  <span className="font-semibold">You : </span>
                )}

              {chat.latestMessage
                ? chat.latestMessage.content.length > 30
                  ? chat.latestMessage.content.slice(0, 29) + "...."
                  : chat.latestMessage.content
                : chatWithUser.phone_number}
            </div>
            {noOfNotificationInThisChat > 0 && (
              <span className="float-right absolute right-5 bottom-4 bg-green-500 pl-[7px] rounded-full w-6 h-6 text-white font-bold">
                {noOfNotificationInThisChat}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatListItem;
