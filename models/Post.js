const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String], // ممكن يبقى لينكات Cloudinary أو اسم الملف لو بتخزن محلي
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
