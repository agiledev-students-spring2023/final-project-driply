#!/usr/bin/env node

// import the express app
const server = require("./app");
require("dotenv").config({ silent: true }); // load environmental variables from a hidden file named .env
const socket = require("socket.io");
const Chat = require("./models/Chat.js");


// which port to listen for HTTP(S) requests
const port = process.env.PORT || 4000;

// call a function to start listening to the port
const listener = server.listen(port, function () {
  console.log(`Server running on port: ${port}`);
});

const io = socket(listener, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
})

io.on("connection", async (socket) => {
  console.log("a user has connected");
  const chatId = socket.handshake.query.chatId;
  const members = chatId.split("--");
  const chatRoom = await Chat.findOne({ chatId });
  if (!chatRoom) {
    const room = await Chat.createroom(chatId, members);
    socket.emit('createdRoom', { room: room, newChat: true, messages: [] });
  } else {
    socket.emit('createdRoom', { room: chatRoom, newChat: false, messages: chatRoom.messages });
  }

  socket.on("sendMessage", async (data) => {
    const messages = chatRoom.messages;
    const { id_from, message } = data;
    const newMsg = { id_from, message };
    const room = await Chat.findOneAndUpdate(
      {chatId: chatId},
      {$push: { messages:  newMsg }},
      { new: true }
    );
    console.log(room);
    messages.push(data);
    console.log(messages);
    io.emit("sendMessage", { messages: room.messages });
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
