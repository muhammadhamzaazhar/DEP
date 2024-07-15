const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    let errorMessage = "Registration failed";
    if (error.code === 11000) {
      errorMessage = "Username already exists. Please choose another.";
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

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ message: "Incorrect Credentials" });
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { username, id: userDoc._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res
            .cookie("token", token, { httpOnly: true, sameSite: "strict" })
            .json({
              id: userDoc._id,
              username,
            });
        }
      );
    } else {
      res.status(400).json({ message: "Incorrect Credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
};

const profile = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json("No token provided");
  }
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) return res.status(403).json("Token verification failed");
    res.json(info);
  });
};

module.exports = {
  register,
  login,
  profile,
};
