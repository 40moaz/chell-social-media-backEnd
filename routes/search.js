const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const router = express.Router();

router.get("/search", async (req, res) => {
  const query = req.query.q;
  const searchType = req.query.type;

  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }

  try {
    let results = {
      users: [],
      posts: [],
    };

    const searchRegex = new RegExp(query, "i");

    // البحث في المستخدمين
    if (!searchType || searchType === "users") {
      const users = await User.find({
        $or: [{ username: searchRegex }, { fullName: searchRegex }],
      }).select("username fullName profileImage");
      results.users = users;
    }

    // البحث في البوستات
    if (!searchType || searchType === "posts") {
      const posts = await Post.find({ text: searchRegex })
        .populate("userId", "username fullName profileImage")
        .select("text images userId");
      results.posts = posts;
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ message: "Server error during search." });
  }
});

module.exports = router;
