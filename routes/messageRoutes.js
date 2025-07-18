// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/", messageController.sendMessage);
router.get("/:user1/:user2", messageController.getMessages);
router.patch("/:id/seen", messageController.markAsSeen);

module.exports = router;
