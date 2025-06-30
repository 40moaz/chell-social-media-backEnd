// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // إنهاء البرنامج لو فشل الاتصال
  }
};

module.exports = connectDB;
