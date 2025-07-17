const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Notification = require("../models/Notification");
const sendPushNotification = require("../utils/sendPushNotification");
router.post("/", async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    const saved = await newNotification.save();

    // إرسال إشعار لو المستخدم عنده FCM Token
    const user = await User.findById(saved.receiverId);
    if (user?.fcmToken) {
      await sendPushNotification(
        user.fcmToken,
        "new_notification",
        saved.text || "new notification"
      );
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/save-token", async (req, res) => {
  const { userId, fcmToken } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { fcmToken });
    res.status(200).json({ message: "FCM token saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save token" });
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
