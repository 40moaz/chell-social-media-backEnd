const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Notification = require("../models/Notification");
router.post("/", async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    const saved = await newNotification.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// جلب إشعارات مستخدم
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiverId: req.params.userId,
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "fullName profileImage username")
      .populate("postId", "content image");
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// routes/notifications.js
router.get("/unseen-count/:userId", async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      receiverId: req.params.userId,
      seen: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unseen count", error });
  }
});

// وضع الكل كمقروء
router.put("/seen/:userId", async (req, res) => {
  try {
    await Notification.updateMany(
      { receiverId: req.params.userId, seen: false },
      { $set: { seen: true } }
    );
    res.json({ message: "All notifications marked as seen." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
