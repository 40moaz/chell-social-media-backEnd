// api/index.js
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

dotenv.config();

const app = express();

// DB Connection
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running from Vercel Serverless!");
});

app.use("/api/auth", require("../routes/auth"));
console.log("🔍 MONGO_URI = ", process.env.MONGO_URI);

// Export as handler
module.exports.handler = serverless(app);
