const express = require("express");
const multer = require("multer");
const {
  createPost,
  updatePost,
  getPosts,
  getPostById,
  deletePost,
} = require("../../controllers/posts/posts");

const uploadMiddleware = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/", uploadMiddleware.single("file"), createPost);
router.put("/", uploadMiddleware.single("file"), updatePost);
router.delete("/:id", deletePost);
router.get("/", getPosts);
router.get("/:id", getPostById);

module.exports = router;
