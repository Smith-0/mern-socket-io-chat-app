import express from "express";
import multer from "multer";

import {
  register,
  login,
  getAllUsers,
  updateUser,
} from "../controllers/userController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage: storage });

router.post("/register", upload.single("picture"), register);
router.post("/update", auth, upload.single("picture"), updateUser);
router.post("/login", login);
router.get("/", auth, getAllUsers);

export default router;
