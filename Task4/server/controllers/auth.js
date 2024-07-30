const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/Users");

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).send("Please fill all required fields");

    const isAlreadyExist = await User.findOne({ email });
    if (isAlreadyExist) return res.status(400).send("User already exists");

    const salt = bcrypt.genSaltSync(10);
    const userDoc = await User.create({
      fullName,
      email,
      password: bcrypt.hashSync(password, salt),
    });

    res.json(userDoc);
  } catch (error) {
    let errorMessage = "Registration failed";
    if (error.code === 11000) {
      errorMessage = "Email already exists. Please choose another.";
    } else if (error.errors) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      errorMessage = validationErrors.join(", ");
    } else {
      errorMessage = error.message;
    }
    res.status(400).json({ message: errorMessage });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Please fill all required fields");
    }

    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(400).json({ message: "Incorrect Credentials" });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      const payload = {
        userId: userDoc._id,
        email: userDoc.email,
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" },
        async (err, token) => {
          if (err) {
            console.error("Error generating token:", err);
            return res.status(500).json({ message: "Token generation failed" });
          }

          try {
            await User.updateOne(
              { _id: userDoc._id },
              {
                $set: { token },
              }
            );

            return res.status(200).json({
              user: {
                id: userDoc._id,
                email: userDoc.email,
                fullName: userDoc.fullName,
              },
              token: token,
            });
          } catch (updateError) {
            console.error("Error updating user with token:", updateError);
            return res
              .status(500)
              .json({ message: "Failed to update user token" });
          }
        }
      );
    } else {
      return res.status(400).json({ message: "Incorrect Credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again." });
  }
};

module.exports = {
  register,
  login,
};
