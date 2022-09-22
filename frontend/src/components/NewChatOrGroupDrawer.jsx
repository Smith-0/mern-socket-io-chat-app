import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Box,
  HStack,
  Tag,
  TagCloseButton,
  TagLabel,
  DrawerFooter,
} from "@chakra-ui/react";
import {
  BsArrowLeft,
  BsSearch,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import UserListItem from "./UserListItem";
import { getAllUsers } from "../actions/userAction";
import { accessChat } from "../actions/chatAction";

const NewChatOrGroupDrawer = ({ isOpen, onClose, btnRef, type }) => {
  const dispatch = useDispatch();
  const currentUser = JSON.parse(localStorage.getItem("userData"))?.user;
  const { users } = useSelector((state) => state.users);
  const { chats } = useSelector((state) => state.chats);
  const [addGroupUsers, setAddGroupUsers] = useState(users);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userIdsArray, setUserIdsArray] = useState([]);
  const [usersInGroupBadge, setUsersInGroupBadge] = useState([]);

  useEffect(() => {
    if (currentUser) dispatch(getAllUsers(searchQuery));
  }, [searchQuery, dispatch]);

  useEffect(() => {
    setAddGroupUsers(users);
  }, [users]);

  const onClickHandler = (otherUser) => {
    const isChatExisted = chats.find((chat) =>
      chat.users.find((user) => user._id === otherUser._id)
    );
    let actionType = "ACCESS_CHAT";

    if (type === "CHAT") {
      if (isChatExisted) {
        actionType = "ACCESS_CHAT";
      } else {
        actionType = "CREATE_CHAT";
      }
      dispatch(accessChat(otherUser._id, actionType));
      onClose();
    } else {
      setUserIdsArray([...userIdsArray, otherUser._id]);
      setAddGroupUsers(
        addGroupUsers.filter((user) => user._id !== otherUser._id)
      );
      setUsersInGroupBadge([...usersInGroupBadge, otherUser]);
    }
  };

  const badgeCloseHandler = (otherUser) => {
    setUserIdsArray(userIdsArray.filter((user) => user._id !== otherUser._id));
    setAddGroupUsers([...addGroupUsers, otherUser]);
    setUsersInGroupBadge(
      usersInGroupBadge.filter((user) => user._id !== otherUser._id)
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      finalFocusRef={btnRef}
      size={{ base: "xl", md: "md" }}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader pt="4rem" className="bg-[#008069] text-white">
          <BsArrowLeft
            onClick={onClose}
            className="inline mr-5 cursor-pointer"
          />
          Create new {type.toLowerCase()}
        </DrawerHeader>

        <DrawerBody p="0">
          {/* <BsArrowLeft
            onClick={onClose}
            className="inline mr-5 cursor-pointer absolute left-9 top-[8.3rem] z-10 text-[#54656f]"
          /> */}
          <Box px="1.3rem" className="fixed w-full z-10 bg-white p-2 shadow">
            <BsSearch className="inline mr-5 cursor-pointer absolute left-9 top-[1rem] z-20 text-[#6e7d86]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#f0f2f5] text-lg rounded-lg w-[100%] px-12 py-2 outline-none"
              placeholder="Search User"
            />
          </Box>
          <br />
          <br />
          <br />

          <HStack mx="1.3rem" spacing={4}>
            {usersInGroupBadge?.map((user, index) => (
              <Tag
                key={index}
                pb="1.5px"
                size="sm"
                borderRadius="full"
                variant="solid"
                bg="#d9fdd3"
                color="black"
              >
                <TagLabel>{user.name}</TagLabel>
                <TagCloseButton onClick={() => badgeCloseHandler(user)} />
              </Tag>
            ))}
          </HStack>

          <br />

          {addGroupUsers?.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              onClickHandler={onClickHandler}
            />
          ))}
        </DrawerBody>
        <DrawerFooter m="0px" p="0px">
          {type === "GROUP" && (
            <div className="bg-[#f0f2f5] py-8 shadow-lg w-full">
              {usersInGroupBadge.length > 1 ? (
                <BsFillArrowRightCircleFill className="mx-auto text-5xl text-[#00A884]" />
              ) : (
                <div className="text-center text-xl text-gray-700">
                  Atleast add two users to make a group
                </div>
              )}
            </div>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NewChatOrGroupDrawer;
