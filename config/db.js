// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://amoaz14109:MoazAli123@chell.jynoyjz.mongodb.net/?retryWrites=true&w=majority&appName=chell");

    console.log(`✅ MongoDB Connected`);
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
