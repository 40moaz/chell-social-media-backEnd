// routes/bookmark.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

// Add bookmark
exports.AddBookmark = async (req, res) => {
  try {
    const userId = req.user.id; // Use from JWT or session
    const { postId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $addToSet: { bookmarks: postId },
    });

    res.status(200).json({ message: "Post bookmarked." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove bookmark
exports.removeBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { bookmarks: postId },
    });

    res.status(200).json({ message: "Bookmark removed." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all bookmarks
exports.getAllBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("bookmarks");

    res.status(200).json(user.bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};