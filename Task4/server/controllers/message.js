const Message = require("../models/Messages");
const User = require("../models/Users");
const Conversation = require("../models/Conversations");

const message = async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;
    if (!senderId || !message)
      return res.status(400).send("Please fill all required fields");

    if (conversationId === "new" && receiverId) {
      const newCoversation = new Conversation({
        members: [senderId, receiverId],
      });
      await newCoversation.save();
      const newMessage = new Message({
        conversationId: newCoversation._id,
        senderId,
        message,
      });

      await newMessage.save();
      return res.status(200).send("Message sent successfully");
    } else if (!conversationId && !receiverId) {
      return res.status(400).send("Please fill all required fields");
    }

    const newMessage = new Message({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.error(`Error occurred: ${error.message}`);
    res.status(500).json({
      error: "An internal server error occurred. Please try again later.",
    });
  }
};

const userMessages = async (req, res) => {
  try {
    const checkMessages = async (conversationId) => {
      const messages = await Message.find({ conversationId });
      const messageUserData = Promise.all(
        messages.map(async (message) => {
          const user = await User.findById(message.senderId);
          return {
            user: { id: user._id, email: user.email, fullName: user.fullName },
            message: message.message,
          };
        })
      );

      res.status(200).json(await messageUserData);
    };

    const conversationId = req.params.conversationId;
    if (conversationId === "new") {
      const checkConversation = await Conversation.find({
        members: { $all: [req.query.senderId, req.query.receiverId] },
      });
      if (checkConversation.length > 0) {
        checkMessages(checkConversation[0]._id);
      } else {
        return res.status(200).json([]);
      }
    } else {
      checkMessages(conversationId);
    }
  } catch (error) {
    console.error(`Error occurred: ${error.message}`);
    res.status(500).json({
      error: "An internal server error occurred. Please try again later.",
    });
  }
};

module.exports = {
  message,
  userMessages,
};
