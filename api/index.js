// api/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

dotenv.config();

const app = express();

// DB Connection
connectDB(); // Make sure connectDB function is correctly defined and connecting

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running from Vercel Serverless!ss");
});
app.use("/api/posts", require("../routes/posts"));
app.use("/api/comments", require("../routes/comments"));
app.use("/api/followers", require("../routes/followersRoutes")); // This line imports your followers routes
app.use("/api/auth", require("../routes/auth")); // This line imports your auth routes

console.log("🔍 MONGO_URI = ", process.env.MONGO_URI ? "Loaded" : "Not Loaded");

// This is the ONLY export Vercel expects for a serverless-http setup
module.exports = app;
