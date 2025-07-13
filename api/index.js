// api/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const http = require("http");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const clients = require("./clients");

dotenv.config();

const app = express();
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("WebSocket server is running.");
});

// سيرفر WebSocket
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  const clientId = uuidv4();
  clients[clientId] = ws;

  console.log("✅ Client connected:", clientId);

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "send-message") {
        const targetSocket = clients[data.receiverId];
        if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
          targetSocket.send(JSON.stringify({
            type: "receive-message",
            message: {
              senderId: clientId,
              content: data.content,
              createdAt: new Date().toISOString()
            }
          }));
        }
      }
    } catch (err) {
      console.error("❌ Error parsing message:", err);
    }
  });

  ws.on("close", () => {
    delete clients[clientId];
    console.log("❌ Client disconnected:", clientId);
  });
});

// DB Connection
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running from Vercel Serverless!");
});
app.use("/api/messages", require("../routes/messageRoutes"));
app.use("/api/posts", require("../routes/posts"));
app.use("/api/comments", require("../routes/comments"));
app.use("/api/followers", require("../routes/followersRoutes"));
app.use("/api/auth", require("../routes/auth"));

console.log("🔍 MONGO_URI = ", process.env.MONGO_URI ? "Loaded" : "Not Loaded");

// ✅ لازم تستخدم listen هنا
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
