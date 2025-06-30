const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,   // عادة userId مطلوب في البوست
    },
    text: {
      type: String,
      default: "",
    },
    images: {
      type: [String],   // مصفوفة سترينج
      default: [],      // لو ما حطيتش صور
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
