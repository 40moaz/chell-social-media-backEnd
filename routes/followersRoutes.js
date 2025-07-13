// routes/followersRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware"); // Assuming this middleware authenticates the user
const {
  followUser,
  unfollowUser,
  getFollowers,
} = require("../controllers/followersController");

// Get followers of a specific user (no authentication needed for viewing)
router.get("/:userId", getFollowers);

// Follow a user (requires authentication)
router.post("/:userId", protect, followUser);

// Unfollow a user (requires authentication)
router.delete("/:userId", protect, unfollowUser);

module.exports = router;