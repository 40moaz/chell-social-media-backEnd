// firebase/firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("../chell-15104-firebase-adminsdk-fbsvc-39e17ea61d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
