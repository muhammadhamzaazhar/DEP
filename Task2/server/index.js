const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth/auth");
const postRoutes = require("./routes/posts/posts");

dotenv.config();
const app = express();

const corsOptions = {
  credentials: true,
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.PROD_ORIGIN
      : process.env.DEV_ORIGIN,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use("/auth", authRoutes);
app.use("/post", postRoutes);

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

const port = process.env.NODE_ENV === "production" ? process.env.PORT : 4000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port, () => console.log(`Server Port: ${port}`));
  })
  .catch((error) => console.log(`${error}, did not connect`));
