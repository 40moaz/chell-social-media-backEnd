const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAdult = (dateOfBirth) => {
  const today = new Date();
  const dob = new Date(dateOfBirth);
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  return age > 18 || (age === 18 && m >= 0);
};

const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      password,
      phone,
      birthday,
      bio,
      location,
      website,
    } = req.body;

    if (!isAdult(birthday)) {
      return res
        .status(400)
        .json({ message: "You must be at least 18 years old." });
    }

    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (emailExists)
      return res.status(400).json({ message: "Email already registered" });

    if (usernameExists)
      return res.status(400).json({ message: "Username is taken" });

    const newUser = await User.create({
      fullName,
      username,
      email,
      password, // تشفير كلمة السر في الموديل
      phone,
      birthday,
      bio,
      location,
      website,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // identifier ممكن يكون email أو username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "supersecretkey123", {
      expiresIn: "7d",
    });

    res.json({
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// جلب كل المستخدمين
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// جلب مستخدم بواسطة ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser, // 👈 جديد
  getAllUsers,
  getUserById,
};
