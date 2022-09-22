import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import Chat from "../models/ChatModel.js";
import Notification from "../models/NotificationModel.js";

export const sendMessages = async (req, res) => {
  const { content, chatId } = req.body;

  var newMessage = {
    sender: req.userId,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.status(200).send(message);
  } catch (error) {
    console.log(error);
  }
};

export const allMessages = async (req, res) => {
  const chatId = req.params.chatId;

  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.status(200).send(messages);
  } catch (error) {
    console.log(error);
  }
};

export const sendNotification = async (req, res) => {
  const { userId, chatId, message } = req.body;

  const newNotification = {
    user: userId,
    message: message,
    chat: chatId,
  };

  try {
    const notification = await Notification.create(newNotification);
    res.status(200).send(notification);
  } catch (error) {
    console.log(error);
  }
};

export const getAllNotifications = async (req, res) => {
  console.log(req.userId);
  try {
    const notifications = await Notification.find({ user: req.userId });
    res.status(200).send(notifications);
  } catch (error) {
    console.log(error);
  }
};

export const deleteNotification = async (req, res) => {
  const id = req.params.id;
  try {
    await Notification.deleteMany({ chat: id, user: req.userId });
    res.status(200).send("notification deleted");
  } catch (error) {
    console.log(error);
  }
};
