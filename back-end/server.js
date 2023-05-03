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
    origin: process.env.ORIGIN,
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  socket.on("sendMessage", async (data) => {
    const { id_from, message, chatRoomId, members } = data;
    const newMsg = { id_from, message };
    try {
      const room = await Chat.findOneAndUpdate(
        { chatId: chatRoomId },
        { $push: { messages: newMsg } },
        { new: true }
      );
      let userFrom = await User.findOne({ _id: id_from }).select("name");
      let userFromName = "";
      if (userFrom) {
        userFromName = userFrom.name;
      }
      io.emit(`sendMessage-${chatRoomId}`, { messages: room.messages });
      io.emit(`updateChatHistory-${members[0]}`, {
        newMessage: { chatId: room.chatId, id_from, message, userFromName },
      });
      io.emit(`updateChatHistory-${members[1]}`, {
        newMessage: { chatId: room.chatId, id_from, message, userFromName },
      });
    } catch (error) {
      console.log(error);
    }
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
