const express = require("express");

const { message, userMessages } = require("../controllers/message");

const router = express.Router();

router.post("/", message);
router.get("/:conversationId", userMessages);

module.exports = router;
