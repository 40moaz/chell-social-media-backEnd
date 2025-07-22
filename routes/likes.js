const express = require("express");
const router = express.Router();
const {
  createLike,
  removeLike,
  getLikesByPost,
} = require("../controllers/likesController");

// POST /likes
router.post("/", createLike);

// DELETE /likes
router.delete("/", removeLike);

// GET /likes/:postId
router.get("/:postId", getLikesByPost);

module.exports = router;
