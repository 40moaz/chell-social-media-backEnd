// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error);
    process.exit(1); // Exit with failure
  }

  // Handle DB disconnect after connected
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected.");
  });

  // Optional: Catch connection errors after connected
  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB runtime error:", err);
  });
};

module.exports = connectDB;
