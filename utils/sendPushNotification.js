const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");
const serviceAccount = require("../chell-15104-firebase-adminsdk-fbsvc-39e17ea61d.json");

const sendPushNotification = async (fcmToken, title, body) => {
  const auth = new GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });

  const accessTokenObj = await auth.getAccessToken();
  const accessToken = accessTokenObj?.token || accessTokenObj;
  console.log(fcmToken, title, body, accessToken);

  const message = {
    message: {
      token: fcmToken,
      notification: {
        title,
        body,
      },
      webpush: {
        headers: {
          Urgency: "high",
        },
        notification: {
          title,
          body,
          icon: "https://your-app.com/icon.png",
        },
      },
    },
  };

  try {
    const response = await axios.post(
      `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
      message,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Notification sent:", response.data);
  } catch (error) {
    console.error(
      "❌ Error sending notification:",
      error.response?.data || error.message
    );
  }
};

module.exports = sendPushNotification;
