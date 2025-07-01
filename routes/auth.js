const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getMe,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.get("/me", protect, getMe); // 👈 هنا راوت me

module.exports = router;
