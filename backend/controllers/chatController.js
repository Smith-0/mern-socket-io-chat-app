import mongoose from "mongoose";
import Chat from "../models/ChatModel.js";
import User from "../models/UserModel.js";

export const accessChat = async (req, res) => {
  const { otherUserId } = req.body;

  var isChat = await Chat.find({
    isGrouoChat: false,
    $and: [
      { users: { $elemMatch: { $eq: otherUserId } } },
      { users: { $elemMatch: { $eq: req.userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name picture phone_number",
  });

  if (isChat.length > 0) {
    res.status(200).send(isChat[0]);
    console.log("existed");
  } else {
    console.log("created");
    var chatData = {
      chatName: "sender",
      isGrouoChat: false,
      users: [req.userId, otherUserId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(201).send(FullChat);
    } catch (error) {
      console.log(error);
    }
  }
};

export const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.userId } },
    })
      .populate("users", "-password") // Populate users excluding their password
      .populate("groupAdmin", "-password") // Populate group admin excluding their password
      .populate("latestMessage") // Populate the latest message
      .sort({ updatedAt: -1 }); // Sort chats by latest updated timestamp

    // Populate the sender of the latest message
    const populatedChats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name picture phone_number", // Select specific fields for sender
    });

    res.status(200).send(populatedChats); // Send the populated chats
  } catch (error) {
    console.error("Error fetching chats:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Failed to fetch chats", error: error.message }); // Send error response with status code 500
  }
};

export const createGroupChat = async (req, res) => {
  var users = req.body.users;

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than two users are required to join a group");
  }

  const currentUser = await User.findOne({ _id: req.userId });
  users.push(currentUser);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: currentUser,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(fullGroupChat);
  } catch (error) {
    console.log(error);
  }
};

export const renameGroupChat = async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!mongoose.isValidObjectId(chatId))
    return res.status(404).send("chat not found");

  try {
    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(updateChat);
  } catch (error) {
    console.log(error);
  }
};

export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  if (!mongoose.isValidObjectId(chatId))
    return res.status(404).send("chat not found");

  if (!mongoose.isValidObjectId(userId))
    return res.status(404).send("user not found");

  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(added);
  } catch (error) {
    console.log(error);
  }
};

export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!mongoose.isValidObjectId(chatId))
    return res.status(404).send("chat not found");

  if (!mongoose.isValidObjectId(userId))
    return res.status(404).send("user not found");

  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(removed);
  } catch (error) {
    console.log(error);
  }
};
