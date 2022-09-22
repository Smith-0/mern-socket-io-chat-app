const messageReducer = (state = { messages: [] }, action) => {
  switch (action.type) {
    case "GET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SEND_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "ADD_NEW__MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
};

export default messageReducer;
