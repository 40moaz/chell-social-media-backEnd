// routes/stories.js
const express = require("express");
const router = express.Router();
const Story = require("../models/Story");

// POST /stories
router.post("/", async (req, res) => {
  try {
    const { userId, text, mediaUrl, mediaType, duration, bgColor } = req.body;

    // تحقق من المدة لو mediaType = video
    if (mediaType === "video" && duration > 20) {
      return res.status(400).json({ error: "Video must be 20 seconds max" });
    }

    const story = await Story.create({
      userId,
      text,
      mediaUrl,
      mediaType,
      duration,
      bgColor,
    });

    res.status(201).json(story);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create story" });
  }
});
// PUT /api/stories/:id/view
router.put("/:id/view", async (req, res) => {
  const userId = req.user.id; // from auth middleware
  const storyId = req.params.id;

  try {
    const story = await Story.findById(storyId);

    if (!story.viewers.includes(userId)) {
      story.viewers.push(userId);
      await story.save();
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// GET /api/stories/:id/viewers
router.get('/:id/viewers', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate('viewers', 'username profileImage fullName');
    res.json(story.viewers);
  } catch {
    res.status(500).json({ error: 'Failed to fetch viewers!' });
  }
});

// Get all stories
router.get("/", async (req, res) => {
  try {
    const stories = await Story.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username profileImage fullName"); // المهم هنا

    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get stories by userId
router.get("/:userId", async (req, res) => {
  try {
    const stories = await Story.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
});
// Delete a story
router.delete("/:id", async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.status(200).json({ message: "Story deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
});
module.exports = router;
