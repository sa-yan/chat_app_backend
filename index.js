const express = require("express");
const http = require("http");
const app = express();
const { Server } = require("socket.io");
const path = require("path");
const mongoose = require("mongoose");

const Msg = require("./models/models");

const mongoUrl =
  "mongodb+srv://geekysayan:sayan2003@cluster0.itllhoq.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected...");
  })
  .catch(() => {
    console.log("Failed to connect");
  });

const server = http.createServer(app);

const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("A new user has connected", socket.id);

  try {
    const messages = await Msg.find();
    console.log("Messages from the database:", messages);

    // Send the messages to the connected client
    socket.emit("output-message", messages);
  } catch (err) {
    console.error("Error fetching messages from the database:", err);
  }

  socket.on("get-initial-messages", (socket) => {
    // Fetch initial messages from the database or another source
    Msg.find()
      .then((res) => {
        // Emit the initial messages to the client
        socket.emit("initial-messages", res);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on("join", function (userNickname) {
    console.log(userNickname + " : has joined the chat ");
    socket.broadcast.emit(
      "userjoinedthechat",
      userNickname + " : has joined the chat "
    );
  });

  socket.emit("message", "Hello world");

  socket.on("messagedetection", (name, message) => {
    console.log(name + " : " + message);
    let messages = { message: message, senderNickname: name };

    const message_db = new Msg({ msg: message });

    message_db.save().then(() => {
      // send the message to the client side
      io.emit("message", messages);
      console.log("message", messages);
    });
  });

  socket.on("disconnect", function () {
    console.log("user has left ");
    socket.broadcast.emit("userdisconnect", " user has left");
  });
});

app.use(express.static(path.resolve("./")));

app.get("/", (req, res) => {
  res.send("Chat server is running");
});

const port = process.env.PORT || 3000;

server.listen(port || 3000, () => {
  console.log(`Node app is running on port ${port}`);
});

///socket.io/socket.io.js
