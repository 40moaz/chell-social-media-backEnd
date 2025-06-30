const express = require("express");
const router = express.Router();
const { registerUser, getAllUsers, getUserById } = require("../controllers/authController");

// تسجيل مستخدم جديد
router.post("/register", registerUser);

// جلب كل المستخدمين
router.get("/users", getAllUsers);

// جلب مستخدم بالـ ID
router.get("/users/:id", getUserById);

module.exports = router;
