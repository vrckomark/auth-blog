const express = require("express");
const BlogModel = require("../models/blog");

let router = express.Router();

router
  .route("/create")
  .post(async (req, res) => {
    const { title, content, date, author } = req.body;
    blog = new BlogModel({
      title,
      content,
      date,
      author,
    });
    await blog.save();
    res.send("Added blog!");
  })
  .get((req, res) => {
    res.render("create");
  });

module.exports = router;
