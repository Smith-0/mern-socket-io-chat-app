import { combineReducers } from "redux";

import users from "./userReducer";
import chats from "./chatReducer";
import messages from "./messageReducer";

export default combineReducers({ users, chats, messages });
