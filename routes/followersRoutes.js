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
router.post("/:userId", followUser);

// الغِ المتابعة
router.delete("/:userId", unfollowUser);

module.exports = router;
