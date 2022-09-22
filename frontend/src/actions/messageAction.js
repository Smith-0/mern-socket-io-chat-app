import * as api from "../api/indexApi";

export const getAllMessagesInChat = (chatId) => async (dispatch) => {
  try {
    const { data } = await api.getAllMessagesInChat(chatId);
    dispatch({ type: "GET_MESSAGES", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const sendMessage = (chatId, content, socket) => async (dispatch) => {
  try {
    const { data } = await api.sendMessage(chatId, content);
    dispatch({ type: "SEND_MESSAGE", payload: data });
    socket.emit("new message", data);
  } catch (error) {
    console.log(error);
  }
};

export const sendNotification = (notificationData) => async (dispatch) => {
  try {
    const { data } = await api.sendNotification(notificationData);
    dispatch({ type: "SEND_NOTIFICATION", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getNotifications = () => async (dispatch) => {
  try {
    const { data } = await api.getNotifications();
    dispatch({ type: "GET_ALL_NOTIFICATION", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deleteNotification = (chatId) => async (dispatch) => {
  try {
    await api.deleteNotification(chatId);
    dispatch({ type: "DELETE_NOTIFICATION" });
  } catch (error) {
    console.log(error);
  }
};
