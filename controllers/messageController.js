// controllers/messageController.js
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const { clients } = require("../ws/clients"); // أو wherever you defined it
const sendPushNotification = require("../utils/sendPushNotification");
const User = require("../models/User");
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;

    const newMsg = new Message({ sender, receiver, content });
    await newMsg.save();

    // ✅ Create notification in DB
    const newNotif = await Notification.create({
      senderId: sender,
      receiverId: receiver,
      type: "message",
      content,
    });

    // ✅ Send Push Notification if user has FCM token
    const user = await User.findById(receiver);
    const senderUser = await User.findById(sender);

    if (user?.fcmToken) {
      await sendPushNotification(
        user.fcmToken,
        `new message from ${senderUser.fullName}`,
        content.length > 50 ? content.slice(0, 50) + "..." : content
      );
    }

    // ✅ Emit real-time notification if user is online (WebSocket)
    const receiverSocket = clients[receiver];
    if (receiverSocket && receiverSocket.readyState === 1) {
      receiverSocket.send(
        JSON.stringify({
          type: "new-notification",
          notification: {
            senderId: sender,
            receiverId: receiver,
            type: "message",
            createdAt: new Date(),
          },
        })
      );
    }

    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsSeen = async (req, res) => {
  try {
    const msgId = req.params.id;
    await Message.findByIdAndUpdate(msgId, { seen: true });
    res.status(200).json({ message: "Marked as seen" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
