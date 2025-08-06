const express = require("express");
const router = express.Router();
const {
  AddBookmark,
  removeBookmark,
  getAllBookmarks,
} = require("../controllers/bookmarkController");
const protect = require("../middleware/authMiddleware");

// AddBookmark
router.post("/:postId", protect, AddBookmark);

// removeBookmark
router.delete("/:postId", protect, removeBookmark);

// getAllBookmarks
router.get("/", protect, getAllBookmarks);

module.exports = router;
