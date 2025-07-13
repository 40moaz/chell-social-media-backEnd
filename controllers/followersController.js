// controllers/followersController.js
const User = require("../models/User");

// ✅ متابعة مستخدم
const followUser = async (req, res) => {
  const currentUserId = req.user.id;
  const userToFollowId = req.params.userId;

  if (currentUserId === userToFollowId) {
    return res.status(400).json({ message: "You can't follow yourself.." });
  }

  const userToFollow = await User.findById(userToFollowId);
  if (!userToFollow) return res.status(404).json({ message: "User not found" });

  if (!userToFollow.followers.includes(currentUserId)) {
    userToFollow.followers.push(currentUserId);
    await userToFollow.save();
    res.json({ message: "Followed successfully" });
  } else {
    res.status(400).json({ message: "Already following this user" });
  }
};

// ✅ إلغاء المتابعة
const unfollowUser = async (req, res) => {
  const currentUserId = req.user.id;
  const userToUnfollowId = req.params.userId;

  const user = await User.findById(userToUnfollowId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.followers = user.followers.filter(
    (followerId) => followerId.toString() !== currentUserId
  );

  await user.save();
  res.json({ message: "Unfollowed successfully" });
};

// ✅ جلب المتابعين
const getFollowers = async (req, res) => {
  const user = await User.findById(req.params.userId).populate(
    "followers",
    "fullName username profileImage"
  );

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ followers: user.followers });
};

module.exports = { followUser, unfollowUser, getFollowers };
