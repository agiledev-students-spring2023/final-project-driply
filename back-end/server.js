#!/usr/bin/env node

// import the express app
const server = require("./app");
require("dotenv").config({ silent: true }); // load environmental variables from a hidden file named .env
const socket = require("socket.io")


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

io.on("connection", (socket) => {
  console.log("a user has connected");
  socket.emit('test', { message: "conncted" });

  socket.on("test", (data) => {
    console.log(data);
    io.emit("test", { message: "sent data back" });
  });
})

// a function to stop listening to the port
const close = () => {
  listener.close();
};

// export the close function
module.exports = {
  close: close,
};
