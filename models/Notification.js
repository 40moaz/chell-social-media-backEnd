// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "follow", "message"],
      required: true,
    },
    content: { type: String },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // لو لايك أو كومنت
    seen: { type: Boolean, default: false },
    fcmToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
