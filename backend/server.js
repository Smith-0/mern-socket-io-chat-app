import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import path from "path";

import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();
const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();
console.log(__dirname1);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

const server = app.listen(process.env.PORT || 5000, () =>
  console.log(`Example app listening on port ${process.env.PORT || 5000}`)
);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_BASE_URL,
  },
});

io.on("connection", (socket) => {
  console.log(`Connecting to socket`);

  socket.on("setup", (userData) => {
    socket.join(userData?._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room : " + room);
  });

  socket.on("new message", (newRecivedMessage) => {
    var chat = newRecivedMessage.chat;
    if (!chat.users) return console.log("No users available");

    chat.users.forEach((user) => {
      // if (user._id === newRecivedMessage.sender._id) return;
      socket.in(user._id).emit("message recived", newRecivedMessage);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => server)
  .catch((error) => console.log(error));

export default app;
