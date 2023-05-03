#!/usr/bin/env node

// import the express app
const server = require("./app");
require("dotenv").config({ silent: true }); // load environmental variables from a hidden file named .env
const socket = require("socket.io");
const Chat = require("./models/Chat.js");
const User = require("./models/User.js");

// which port to listen for HTTP(S) requests
const port = process.env.PORT || 4000;

// call a function to start listening to the port
// const listener = server.listen(port, function () {
//   console.log(`Server running on port: ${port}`);
// });

const listener = server.listen(port, function () {
  console.log(`Server running on port: ${port}`);
});

const io = socket(listener, {
  cors: {
    origin: process.env.PORT,
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  // console.log("a user has connected");
  const chatId = socket.handshake.query.chatId;
  const userId = socket.handshake.query.userId;
  let chatRoom;

  if (chatId) {
    const members = chatId.split("--");
    chatRoom = await Chat.findOne({ chatId });
    if (!chatRoom) {
      const room = await Chat.createroom(chatId, members);
      socket.emit("createdRoom", {
        room: room,
        newChat: true,
        messages: [],
      });
    } else {
      socket.emit("createdRoom", {
        room: chatRoom,
        newChat: false,
        messages: chatRoom.messages,
      });
    }
  }

  if (userId !== "undefined") {
    const chat = await Chat.find({ members: userId })
      .populate("members", "name profilepic")
      .exec();
    if (!chat) {
      socket.emit("chatHistory", { chatList: [] });
    } else {
      socket.emit("chatHistory", { chatList: chat });
    }
  }

  socket.on("sendMessage", async (data) => {
    const messages = chatRoom.messages;
    const { id_from, message, chatRoomId, members } = data;
    const newMsg = { id_from, message };
    const room = await Chat.findOneAndUpdate(
      { chatId: chatId },
      { $push: { messages: newMsg } },
      { new: true }
    );
    let userFrom = await User.findOne({ _id: id_from }).select("name");
    let userFromName = "";
    if (userFrom) {
      userFromName = userFrom.name;
    }
    messages.push(data);
    io.emit(`sendMessage-${chatRoomId}`, { messages: room.messages });
    io.emit(`updateChatHistory-${members[0]}`, {
      newMessage: { chatId: room.chatId, id_from, message, userFromName },
    });
    io.emit(`updateChatHistory-${members[1]}`, {
      newMessage: { chatId: room.chatId, id_from, message, userFromName },
    });
  });
});

// a function to stop listening to the port
const close = () => {
  listener.close();
};

// export the close function
module.exports = {
  close: close,
};
