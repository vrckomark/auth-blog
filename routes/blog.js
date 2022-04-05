const express = require("express");
const BlogModel = require("../models/blog");

let router = express.Router();

router.post("/create", async (req, res) => {
  const { title, content, date, author } = req.body;
  blog = new BlogModel({
    title,
    content,
    date,
    author,
  });
  await blog.save();
  res.send("Added blog!");
});

module.exports = router;
