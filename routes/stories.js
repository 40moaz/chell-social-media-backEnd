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
      bgColor
    });

    res.status(201).json(story);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create story" });
  }
});

module.exports = router;
