const express = require("express");
const app = require("..");
const BlogModel = require("../models/blog");

let router = express.Router();

router.use(express.static("views"));

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
    res.render("../views/create.ejs", { session });
  });

router.get("/:id", async (req, res) => {
  const blog = await BlogModel.findById(req.params.id);
  res.render("../views/blog.ejs", { blog, session: req.session });
});

module.exports = router;
