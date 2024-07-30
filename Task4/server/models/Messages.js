const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const messageSchema = new Schema({
  conversationId: {
    type: String,
  },
  senderId: {
    type: String,
  },
  message: {
    type: String,
  },
});

const MessageModel = model("Message", messageSchema);

module.exports = MessageModel;
