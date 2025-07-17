// utils/sendNotification.js
const axios = require("axios");

const sendNotification = async (token, title, body) => {
  const serverKey = process.env.FCM_SERVER_KEY;
  const message = {
    to: token,
    notification: {
      title,
      body,
      sound: "default",
    },
    priority: "high",
  };

  try {
    await axios.post("https://fcm.googleapis.com/fcm/send", message, {
      headers: {
        Authorization: `key=${serverKey}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("FCM Error:", err.response?.data || err.message);
  }
};

module.exports = sendNotification;
