const express = require("express");

const {
  conversation,
  userConversations,
} = require("../controllers/conversation");

const router = express.Router();

router.post("/", conversation);
router.get("/:userId", userConversations);

module.exports = router;
