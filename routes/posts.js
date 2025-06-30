const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// GET /posts - جلب كل البوستات
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // أحدث أولاً
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /posts - إضافة بوست جديد
router.post("/", async (req, res) => {
  const { userId, text, images } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const newPost = new Post({
      userId,
      text: text || "",
      images: images || [],
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /posts/:id - تعديل بوست موجود
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { text, images } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // حدث الحقول المطلوبة فقط
    if (text !== undefined) post.text = text;
    if (images !== undefined) post.images = images;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
