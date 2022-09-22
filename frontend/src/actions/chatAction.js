import * as api from "../api/indexApi";

export const fetchChat = () => async (dispatch) => {
  try {
    const { data } = await api.fetchChat();
    dispatch({ type: "FETCH_CHAT", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const accessChat = (id, type) => async (dispatch) => {
  try {
    const { data } = await api.accessChat(id);
    dispatch({ type, payload: data });
  } catch (error) {
    console.log(error);
  }
};
