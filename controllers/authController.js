const User = require("../models/User.js");

const isAdult = (dateOfBirth) => {
  const today = new Date();
  const dob = new Date(dateOfBirth);
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  return age > 18 || (age === 18 && m >= 0);
};

const registerUser = async (req, res) => {
  try {
    const { fullName, username, email, password, phone, birthday } = req.body;

    // Validation (backend برضو)
    if (!isAdult(birthday)) {
      return res.status(400).json({ message: "You must be at least 18 years old." });
    }

    // Check if email or username already exists
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (emailExists)
      return res.status(400).json({ message: "Email already registered" });

    if (usernameExists)
      return res.status(400).json({ message: "Username is taken" });

    // Create user
    const newUser = await User.create({
      fullName,
      username,
      email,
      password, // سيتم تشفيره في الـ model
      phone,
      birthday,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
};
