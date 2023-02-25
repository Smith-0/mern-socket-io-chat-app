import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@chakra-ui/react";
import {
  BsArrowLeftShort,
  BsEmojiLaughing,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { MdSend, MdMessage } from "react-icons/md";
import io from "socket.io-client";
import { toast } from "react-toastify";

import { Menu, Transition } from "@headlessui/react";
import TextareaAutosize from "react-textarea-autosize";
import { getAllMessagesInChat, sendMessage } from "../actions/messageAction";

import Picker from "emoji-picker-react";
import Message from "./Message";

import inChatMsgReceivedSound from "../audio/inChatMsgReceivedSound.mp3";
import notificationSound from "../audio/notificationSound.mp3";
import { fetchChat } from "../actions/chatAction";
import ProfileModal from "./ProfileModal";
import { apiUrl } from "../api/indexApi";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

var socket, selectedChatCompare;

const Conversation = ({
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
  const { messages } = useSelector((state) => state.messages);
  const currentUser = JSON.parse(localStorage.getItem("userData"))?.user;
  const { selectedChat } = useSelector((state) => state.chats);
  const [selectedChatRealTime, setSelectedChatRealTime] =
    useState(selectedChat);
  const [newMessage, setNewMessage] = useState(null);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setSelectedChatRealTime(selectedChat);
    dispatch(getAllMessagesInChat(selectedChat?._id));
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  const otherUser = selectedChatRealTime?.users.filter(
    (user) => user._id !== currentUser?._id
  )[0];

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  useEffect(() => {
    socket = io(apiUrl);

    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.emit("setup", currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (selectedChatRealTime) {
      dispatch(getAllMessagesInChat(selectedChatRealTime._id));

      socket.emit("join chat", selectedChatRealTime._id);
      setChosenEmoji(null);
    }
  }, [dispatch, selectedChatRealTime]);

  useEffect(() => {
    if (chosenEmoji) {
      setMessageInput((prev) => prev + chosenEmoji?.emoji);
    }
  }, [chosenEmoji]);

  socket?.on("message recived", (newRecivedMessage) => {
    setNewMessage(newRecivedMessage);
  });

  useEffect(() => {
    if (newMessage !== null) {
      if (
        selectedChatRealTime?._id !== newMessage.chat._id ||
        !selectedChatRealTime
      ) {
        setNotification({
          from: newMessage.sender.name,
          msg: newMessage.content,
        });

        setAllNotification([
          ...allNotification,
          {
            chatId: newMessage.chat._id,
            from: newMessage.sender.name,
            msg: newMessage.content,
          },
        ]);

        let allNotificationsLocal =
          JSON.parse(localStorage.getItem("allNotification")) || [];

        localStorage.setItem(
          "allNotification",
          JSON.stringify([
            ...allNotificationsLocal,
            {
              chatId: newMessage.chat._id,
              from: newMessage.sender.name,
              msg: newMessage.content,
            },
          ])
        );

        new Audio(notificationSound).play();
      } else {
        dispatch({ type: "ADD_NEW__MESSAGE", payload: newMessage });
        new Audio(inChatMsgReceivedSound).play();
      }
      if (newMessage?.sender._id !== currentUser?._id) dispatch(fetchChat());
    }
  }, [newMessage]);

  const handleTypingInput = (e) => {
    setMessageInput(e.target.value);

    if (socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChatRealTime, currentUser?._id);
    }

    let lastTypingTime = new Date().getTime();

    setTimeout(() => {
      var timeNow = new Date().getTime();
      if (timeNow - lastTypingTime >= 2000 && typing)
        socket.emit("stop typing", selectedChatRealTime, currentUser?._id);
      setTyping(false);
    }, 2000);
  };

  useEffect(() => {
    if (notification !== null)
      toast.success(
        `sahil ghangash ${notification?.from} :- ${notification?.msg}`,
        {
          icon: MdMessage,
          position: "bottom-center",
        }
      );
    setNotification(null);
  }, [notification]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() !== "") {
      dispatch(
        sendMessage(
          selectedChatRealTime?._id,
          messageInput,
          socket,
          currentUser?._id
        )
      );
      setMessageInput("");
      setTyping(false);
    } else {
      alert("Empty Message");
    }
  };

  if (!selectedChatRealTime) {
    return (
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div>
          <img src="https://res.cloudinary.com/dw4odnsfj/image/upload/v1659559797/WhatsApp-MonochromeWithName_ex4zp0.png" />
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileModal
        user={otherUser}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        userType="other"
      />
      <div className="bg-[#f0f2f5] p-3 z-10">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-between items-center">
            <BsArrowLeftShort
              onClick={() => dispatch({ type: "CLOSE_CHAT" })}
              className="mr-3 text-[#54656f] text-2xl cursor-pointer"
            />

            <Avatar
              size="md"
              bg="gray.300"
              name={otherUser.name}
              src={otherUser.picture}
              onClick={onOpen}
              sx={{ cursor: "pointer" }}
            />
            <div className="ml-4 text-xl cursor-pointer" onClick={onOpen}>
              {selectedChatRealTime.isGroupChat
                ? selectedChatRealTime.chatName
                : otherUser.name}
              {isTyping && (
                <p className="block text-xs text-gray-500">typing....</p>
              )}
            </div>
          </div>

          <div className="flex justify-around items-baseline">
            <Menu as="div" className="relative inline-block text-left mx-2">
              <div>
                <Menu.Button className="">
                  <BsThreeDotsVertical className="mr-7 text-[#54656f] text-2xl" />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right right-0 mt-2 w-40 rounded-md shadow-md bg-white absolute z-50">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block w-full text-left px-4 py-2 text-sm"
                          )}
                        >
                          clear messages
                        </button>
                      )}
                    </Menu.Item>
                    {/* <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block w-full text-left px-4 py-2 text-sm"
                          )}
                        >
                          delete chat
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "CLOSE_CHAT" })}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block w-full text-left px-4 py-2 text-sm"
                          )}
                        >
                          close chat
                        </button>
                      )}
                    </Menu.Item> */}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      <div className="messageArea overflow-y-scroll flex flex-col-reverse p-2">
        {messages
          ?.slice(0)
          .reverse()
          .map((message, index) => (
            <Message
              key={index}
              index={index}
              message={message.content}
              user={
                currentUser?._id === message.sender._id ? "CURRENT" : "OTHER"
              }
            />
          ))}
      </div>

      <div className="absolute bottom-0 bg-[#f0f2f5] p-3 w-full flex flex-row justify-between items-center">
        <BsEmojiLaughing
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="inline mr-4 cursor-pointer text-3xl text-[#54656f]"
        />
        <TextareaAutosize
          minRows={1}
          maxRows={3}
          value={messageInput}
          onChange={handleTypingInput}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
          className="bg-[#ffffff] w-full rounded-lg px-5 py-2 outline-none"
          placeholder="Type a message"
        />
        <MdSend
          onClick={handleSendMessage}
          className="inline ml-4 mr-2 cursor-pointer text-4xl text-[#54656f]"
        />
      </div>

      {showEmojiPicker && (
        <div className="absolute bottom-[4.1rem]">
          <Picker onEmojiClick={onEmojiClick} pickerStyle={{ width: "100%" }} />
        </div>
      )}
    </>
  );
};

export default Conversation;
