// api/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const http = require("http");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

const app = express();
const server = http.createServer(app); // ⬅️ هنجمع بينهم هنا
const wss = new WebSocket.Server({ server }); // ⬅️ WebSocket على نفس السيرفر

const clients = {};

connectDB(); // ✅ connect DB

app.use(cors());
app.use(express.json());

// API Routes
app.get("/", (req, res) => {
  res.send("✅ Express API is running");
});
app.use("/api/posts", require("../routes/posts")); // ← دي تشتغل تمام كده
app.use("/api/messages", require("../routes/messageRoutes"));
// باقي الراوتس ...

// WebSocket Logic
wss.on("connection", (ws) => {
  const clientId = uuidv4();
  clients[clientId] = ws;

  console.log("✅ WebSocket connected:", clientId);

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "send-message") {
        const receiverSocket = clients[data.receiverId];
        if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
          receiverSocket.send(
            JSON.stringify({
              type: "receive-message",
              message: {
                senderId: clientId,
                content: data.content,
                createdAt: new Date().toISOString(),
              },
            })
          );
        }
      }
    } catch (err) {
      console.error("❌ Invalid message format:", err.message);
    }
  });

  ws.on("close", () => {
    delete clients[clientId];
    console.log("❌ WebSocket closed:", clientId);
  });
});

// ✅ Start the combined server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
