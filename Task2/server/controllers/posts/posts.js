const fs = require("fs");
const jwt = require("jsonwebtoken");

const Post = require("../../models/Post");

const createPost = async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json("No token provided");
  }

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) return res.status(403).json("Token verification failed");
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
};

const updatePost = async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json("No token provided");
  }

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) return res.status(403).json("Token verification failed");

    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("You are not the author");
    }

    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    if (newPath) {
      postDoc.cover = newPath;
    }
    await postDoc.save();

    res.json(postDoc);
  });
};

const getPosts = async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json("No token provided");
  }

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) return res.status(403).json("Token verification failed");

    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

    if (!isAuthor) {
      return res.status(400).json("You are not the author");
    }

    if (postDoc.cover) {
      fs.unlink(postDoc.cover, (err) => {
        if (err) console.log("Error deleting cover image: ", err);
      });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully" });
  });
};

module.exports = {
  createPost,
  updatePost,
  getPosts,
  getPostById,
  deletePost,
};
