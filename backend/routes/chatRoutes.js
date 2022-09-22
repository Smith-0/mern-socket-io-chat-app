import express from "express";
import auth from "../middlewares/auth.js";

import {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/", auth, accessChat);
router.get("/", auth, fetchChats);
router.post("/group", auth, createGroupChat);
router.put("/group/rename", auth, renameGroupChat);
router.put("/group/add", auth, addToGroup);
router.put("/group/remove", auth, removeFromGroup);

export default router;
