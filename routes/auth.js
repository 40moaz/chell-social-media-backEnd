const express = require("express");
const router = express.Router();
const { registerUser, getAllUsers, getUserById, loginUser, getMe } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware")
// تسجيل مستخدم جديد
router.post("/register", registerUser);

router.post("/login", loginUser);
// جلب كل المستخدمين
router.get("/me", protect, getMe);

router.get("/users", getAllUsers);

// جلب مستخدم بالـ ID
router.get("/users/:id", getUserById);

module.exports = router;
