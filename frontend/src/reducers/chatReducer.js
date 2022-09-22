const chatReducer = (state = { chats: [] }, action) => {
  switch (action.type) {
    case "FETCH_CHAT":
      return { ...state, chats: action.payload };
    case "ACCESS_CHAT":
      return {
        ...state,
        selectedChat: state.chats.find(
          (chat) => chat._id === action.payload._id
        ),
      };
    case "CREATE_CHAT":
      return {
        ...state,
        chats: [...state.chats, action.payload],
        selectedChat: state.chats.find(
          (chat) => chat._id === action.payload._id
        ),
      };
    case "SELECT_CHAT":
      return {
        ...state,
        selectedChat: state.chats.find((chat) => chat._id === action.id),
      };
    case "CLOSE_CHAT":
      return {
        ...state,
        selectedChat: null,
      };

    default:
      return state;
  }
};

export default chatReducer;
