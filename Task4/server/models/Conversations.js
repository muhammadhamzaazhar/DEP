const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const converationSchema = new Schema({
  members: {
    type: Array,
    required: true,
  },
});

const ConversationModel = model("Conversation", converationSchema);

module.exports = ConversationModel;
