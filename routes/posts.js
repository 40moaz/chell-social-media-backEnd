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

// routes/posts.js
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const userPosts = await Post.find({ userId: req.params.id }).sort({
      createdAt: -1,
    });
    res.json(userPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ⚠️ Route خطير - استخدمه بحذر وامسحه بعدين
router.delete("/delete-all", async (req, res) => {
  try {
    await Post.deleteMany({});
    res.status(200).json({ message: "All posts deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete posts." });
  }
});

// POST /posts - إضافة بوست جديد
router.post("/", async (req, res) => {
  const { userId, text, images, videos } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }
  if (userId === undefined) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const newPost = new Post({
      userId,
      text: text || "",
      images: images || [],
      videos: videos || [],
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
  const { text, images, videos } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // حدث الحقول المطلوبة فقط
    if (text !== undefined) post.text = text;
    if (images !== undefined) post.images = images;
    if (videos !== undefined) post.videos = videos;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
