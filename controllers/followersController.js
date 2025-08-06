const Notification = require("../models/Notification");
const { clients } = require("../ws/clients");
const User = require("../models/User");
// =========================== FOLLOW CONTROLLER =============================
const followUser = async (req, res) => {
  const currentUserId = req.user.id;
  const userToFollowId = req.params.userId;

  if (currentUserId === userToFollowId)
    return res.status(400).json({ message: "You cannot follow yourself." });

  try {
    const userToFollow = await User.findById(userToFollowId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser)
      return res.status(404).json({ message: "User not found." });

    if (userToFollow.followers.includes(currentUserId))
      return res.status(400).json({ message: "Already following." });

    userToFollow.followers.push(currentUserId);
    await userToFollow.save();

    // ✅ Create Notification
    await Notification.create({
      senderId: currentUserId,
      receiverId: userToFollowId,
      type: "follow",
    });

    const receiverSocket = clients[userToFollowId];
    if (receiverSocket && receiverSocket.readyState === 1) {
      receiverSocket.send(
        JSON.stringify({
          type: "new-notification",
          notification: {
            senderId: currentUserId,
            receiverId: userToFollowId,
            type: "follow",
            createdAt: new Date(),
          },
        })
      );
    }

    res.status(200).json({
      message: "Followed successfully",
      isFollowing: true,
      followersCount: userToFollow.followers.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Error following user." });
  }
};

// ✅ Unfollow a user
const unfollowUser = async (req, res) => {
  const currentUserId = req.user.id; // ID of the logged-in user
  const userToUnfollowId = req.params.userId; // ID of the user to unfollow

  if (currentUserId === userToUnfollowId) {
    return res.status(400).json({ message: "You cannot unfollow yourself." });
  }

  try {
    const userToUnfollow = await User.findById(userToUnfollowId);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if current user is actually following
    if (!userToUnfollow.followers.includes(currentUserId)) {
      return res
        .status(400)
        .json({ message: "You are not following this user." });
    }

    // Remove currentUserId from the followers array of userToUnfollow
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (followerId) => followerId.toString() !== currentUserId
    );
    await userToUnfollow.save();

    // Optionally, remove userToUnfollowId from the following array of currentUser
    // currentUser.following = currentUser.following.filter(
    //   (followingId) => followingId.toString() !== userToUnfollowId
    // );
    // await currentUser.save();

    res.status(200).json({
      message: "Unfollowed successfully",
      isFollowing: false,
      followersCount: userToUnfollow.followers.length,
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ message: "Server error while unfollowing user." });
  }
};

// ✅ Get followers of a user
const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId); // .populate("followers", "fullName username profileImage");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Only return the IDs for the frontend to determine follow status
    // If you need full follower details, then populate.
    res.status(200).json({ followers: user.followers });
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({ message: "Server error while fetching followers." });
  }
};

module.exports = { followUser, unfollowUser, getFollowers };
