const express = require("express");
const BlogModel = require("../models/blog");

let router = express.Router();

router
  .route("/create")
  .post(async (req, res) => {
    const { title, content, author } = req.body;
    const date = new Date();
    blog = new BlogModel({
      title,
      content,
      date,
      author,
    });
    await blog.save();
    res.redirect("/");
  })
  .get((req, res) => {
    const session = req.session;
    res.render("create", { session });
  });

router.get("/:id", async (req, res) => {
  const blog = await BlogModel.findById(req.params.id);
  res.render("../views/blog", { blog });
});

module.exports = router;
