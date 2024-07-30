const User = require("../models/Users");

const getUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({ _id: { $ne: userId } });
    const usersData = Promise.all(
      users.map(async (user) => {
        return {
          user: {
            email: user.email,
            fullName: user.fullName,
            receiverId: user._id,
          },
        };
      })
    );

    res.status(200).json(await usersData);
  } catch (error) {
    console.error(`Error occurred: ${error.message}`);
    res.status(500).json({
      error: "An internal server error occurred. Please try again later.",
    });
  }
};

module.exports = {
  getUsers,
};
