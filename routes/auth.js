const express = require("express");
const router = express.Router();
const {
  updateUser,
  registerUser,
  getAllUsers,
  getUserById,
  loginUser,
  getMe,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
// تسجيل مستخدم جديد
router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getMe);

router.get("/users", getAllUsers);

router.get("/users/:id", getUserById);

router.patch("/users/:id", updateUser);

module.exports = router;
