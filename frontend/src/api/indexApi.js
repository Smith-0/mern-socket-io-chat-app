import axios from "axios";
export const apiUrl = "https://web-production-7ccd.up.railway.app";

const API = axios.create({
  baseURL: apiUrl,
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
