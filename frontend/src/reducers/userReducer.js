const userReducer = (state = { userData: [], users: [] }, action) => {
  switch (action.type) {
    case "SIGN_UP":
    case "SIGN_IN":
      localStorage.setItem("userData", JSON.stringify(action.payload));
      return { ...state, userData: action.payload };
    case "GET_USERS":
      return { ...state, users: action.payload };
    case "ADD_USERS":
      return { ...state, users: [...state.users, action.user] };
    case "REMOVE_USERS":
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.id),
      };
    case "LOGOUT":
      localStorage.clear();
      return null;
    default:
      return state;
  }
};

export default userReducer;
