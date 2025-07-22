const Like = require("../models/Like");

// POST /likes - add or update reaction
exports.createLike = async (req, res) => {
  try {
    const { userId, postId, reaction } = req.body;

    const existing = await Like.findOne({ userId, postId });

    if (existing) {
      // update existing reaction
      existing.reaction = reaction;
      await existing.save();
      return res.status(200).json(existing);
    }

    const newLike = await Like.create({ userId, postId, reaction });
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
