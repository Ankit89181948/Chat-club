const express = require("express");
const { Server } = require("socket.io");
var http = require("http");
const cors = require("cors");

const app = express();
app.use(cors());

var server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {
  res.send("it is working");
  res.end();
});

io.on("connection", (socket) => {
  console.log("Client connected: ", socket.id);

  
  socket.on("createRoom", ({ roomName, userName }) => {
    // Create a room with socket.id as the room ID
    socket.join(socket.id); 

    console.log(`Room created with ID: ${socket.id} for room name: ${roomName}`);

    // Emit back to the client with roomId and roomName
    socket.emit("roomCreated", { roomId: socket.id, roomName });
  });

  // Handle joining an existing room
  socket.on("joinRoom", (roomId) => {
    console.log(`User joined room: ${roomId}`);
    socket.join(roomId);
    socket.emit("roomJoined", roomId);
  });

  // Handle new messages
  socket.on("newMessage", ({ newMessage, room }) => {
    // Emit the new message to everyone in the room except the sender
    socket.broadcast.to(room).emit("getLatestMessage", newMessage);
  });
});

const port = process.env.PORT || 9000;

server.listen(port, console.log(`App started at port ${port}`));
