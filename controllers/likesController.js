const Like = require("../models/Like");

// POST /likes - add like
exports.createLike = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    // Check if already liked
    const existing = await Like.findOne({ userId, postId });
    if (existing) {
      return res.status(400).json({ message: "Already liked" });
    }

    const newLike = await Like.create({ userId, postId });
    res.status(201).json(newLike);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /likes - remove like
exports.removeLike = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    await Like.findOneAndDelete({ userId, postId });
    res.json({ message: "Like removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /likes/:postId - get likes on a post
exports.getLikesByPost = async (req, res) => {
  try {
    const likes = await Like.find({ postId: req.params.postId });
    res.json(likes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
