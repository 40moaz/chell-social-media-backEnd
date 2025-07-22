const Like = require("../models/Like");

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// @desc    Create a like
// @route   POST /api/likes
// @access  Private
router.post("/", protect, async (req, res) => {
  const { postId } = req.body;

  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  try {
    const like = await Like.create({
      user: req.user._id,
      post: postId,
    });

    res.status(201).json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// @desc    Get likes for a post
// @route   GET /api/likes/:postId
// @access  Public
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const likes = await Like.find({ post: postId }).populate(
      "user",
      "name avatar"
    );

    res.status(200).json(likes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// @desc    Delete a like
// @route   DELETE /api/likes/:likeId
// @access  Private
router.delete("/:likeId", protect, async (req, res) => {
  const { likeId } = req.params;

  try {
    const like = await Like.findById(likeId);
    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }
    if (like.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await like.remove();
    res.status(200).json({ message: "Like removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
