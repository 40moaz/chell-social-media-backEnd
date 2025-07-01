const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// إضافة تعليق على بوست
router.post("/", async (req, res) => {
  try {
    const { userId, text, postId } = req.body;

    if (!text || !postId) {
      return res.status(400).json({ message: "Text and postId are required" });
    }

    const newComment = new Comment({ userId, text, postId });
    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
});

// جلب كل التعليقات (أو تعليقات بوست معين)
router.get("/", async (req, res) => {
  try {
    const { postId } = req.query;

    const filter = postId ? { postId } : {};
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
