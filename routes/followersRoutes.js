// routes/followersRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  followUser,
  unfollowUser,
  getFollowers,
} = require("../controllers/followersController");

// احصل على المتابعين
router.get("/:userId", getFollowers);

// تابع مستخدم
router.post("/:userId", protect, followUser);

// الغِ المتابعة
router.delete("/:userId", protect, unfollowUser);

module.exports = router;
