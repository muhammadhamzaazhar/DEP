const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [4, "Username must be at least 4 characters long"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

const UserModel = model("User", userSchema);

module.exports = UserModel;
