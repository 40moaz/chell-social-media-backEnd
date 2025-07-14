const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const { clients } = require("../ws/clients"); // افترضنا إن clients متصدر من ملف ws
const Post = require("../models/Post");
router.post("/", async (req, res) => {
  try {
    const { userId, text, postId } = req.body;

    if (!text || !postId)
      return res.status(400).json({ message: "Text and postId are required" });

    const newComment = new Comment({ userId, text, postId });
    const savedComment = await newComment.save();

    // ✅ Get post owner
    const post = await Post.findById(postId);
    if (post && post.userId.toString() !== userId) {
      const notification = await Notification.create({
        senderId: userId,
        receiverId: post.userId,
        postId,
        type: "comment",
      });

      // ✅ ابعت WebSocket notification
      const receiverSocket = clients[post.userId.toString()];
      if (receiverSocket && receiverSocket.readyState === 1) {
        receiverSocket.send(
          JSON.stringify({
            type: "new-notification",
            notification,
          })
        );
      }
    }

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const { postId, userId } = req.query;

    const filter = {};
    if (postId) filter.postId = postId;
    if (userId) filter.userId = userId;

    const comments = await Comment.find(filter).sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
});

// حذف تعليق بالـ ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
});

module.exports = router;
