// api/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const { Server } = require("socket.io");
const http = require("http");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});
// Socket.io connection
// ✅ WebSocket logic
io.on("connection", (socket) => {
  console.log("🔌 New client connected: ", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`🟢 User ${userId} joined their room`);
  });

  socket.on("send-message", (data) => {
    const { sender, receiver, content } = data;
    // Send to the receiver's room
    io.to(receiver).emit("receive-message", data);
    console.log(`📩 Message sent from ${sender} to ${receiver}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});
// DB Connection
connectDB(); // Make sure connectDB function is correctly defined and connecting

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running from Vercel Serverless!ss");
});
app.use("/api/messages", require("../routes/messageRoutes")); // This line imports your message routes
app.use("/api/posts", require("../routes/posts"));
app.use("/api/comments", require("../routes/comments"));
app.use("/api/followers", require("../routes/followersRoutes")); // This line imports your followers routes
app.use("/api/auth", require("../routes/auth")); // This line imports your auth routes

console.log("🔍 MONGO_URI = ", process.env.MONGO_URI ? "Loaded" : "Not Loaded");

// This is the ONLY export Vercel expects for a serverless-http setup
module.exports = app;
