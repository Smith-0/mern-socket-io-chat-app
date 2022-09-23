import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-chat-app-socket.herokuapp.com",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("userData")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("userData")).token
    }`;
  }
  return req;
});

// FOR USER

export const getAllUsers = (searchQuery) =>
  API.get(`/user?search=${searchQuery}`);

// FOR CHAT

export const fetchChat = () => API.get("/chat");
export const accessChat = (otherUserId) => API.post("/chat", { otherUserId });

// FOR Messages

export const sendMessage = (chatId, content) =>
  API.post("/message", { chatId, content });
export const getAllMessagesInChat = (chatId) => API.get(`/message/${chatId}`);
export const sendNotification = (notificationData) =>
  API.get(`/message/notification/create`, notificationData);
export const getNotifications = () => API.get(`/message/notification/getAll`);
export const deleteNotification = (chatId) =>
  API.get(`/message/notification/${chatId}`);
