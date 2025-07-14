const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const http = require("http");
const WebSocket = require("ws");

dotenv.config();

const app = express();
const server = http.createServer(app); // ⬅️ لازم تعمل كده علشان تستخدمه في WebSocket
const wss = new WebSocket.Server({ server });

const clients = {}; // ⬅️ هنا هنخزن الـ clients حسب الـ userId

// ✅ Handle WebSocket connections
wss.on("connection", (ws) => {
  let userId = null;

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      if (data.type === "join") {
        userId = data.userId;
        clients[userId] = ws;
        console.log(`🟢 User ${userId} connected`);
      }

      if (data.type === "send-message") {
        const receiverSocket = clients[data.receiverId];
        if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
          receiverSocket.send(
            JSON.stringify({
              type: "receive-message",
              message: {
                senderId: data.senderId,
                receiverId: data.receiverId,
                content: data.content,
                createdAt: data.createdAt,
              },
            })
          );
        }
      }
    } catch (error) {
      console.error("❌ Error parsing message:", error.message);
    }
  });

  ws.on("close", () => {
    if (userId) {
      delete clients[userId];
      console.log(`🔴 User ${userId} disconnected`);
    }
  });
});

// ✅ Connect to DB
connectDB();

app.use(cors());
app.use(express.json());

// ✅ REST API routes
app.use("/api/messages", require("../routes/messageRoutes"));
app.use("/api/posts", require("../routes/posts"));
app.use("/api/comments", require("../routes/comments"));
app.use("/api/followers", require("../routes/followersRoutes"));
app.use("/api/auth", require("../routes/auth"));

// ✅ Simple response for GET /
app.get("/", (req, res) => {
  res.send("WebSocket server is running.");
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
