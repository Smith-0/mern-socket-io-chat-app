import { Routes, Route } from "react-router-dom";
import ChatPage from "./components/ChatPage";
import HomePage from "./components/HomePage";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <ToastContainer position="top-center" autoClose={1500} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
