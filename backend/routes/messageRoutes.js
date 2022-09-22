import express from "express";

import auth from "../middlewares/auth.js";
import {
  allMessages,
  sendMessages,
  sendNotification,
  getAllNotifications,
  deleteNotification,
} from "../controllers/messageContollers.js";

const router = express.Router();

router.get("/:chatId", auth, allMessages);
router.post("/", auth, sendMessages);
router.post("/notification/create", auth, sendNotification);
router.post("/notification/getAll", auth, getAllNotifications);
router.post("/notification/:id", auth, deleteNotification);

export default router;
