import * as api from "../api/indexApi";

export const getAllUsers = (searchQuery) => async (dispatch) => {
  try {
    const { data } = await api.getAllUsers(searchQuery);
    dispatch({ type: "GET_USERS", payload: data });
  } catch (error) {
    console.log(error);
  }
};
