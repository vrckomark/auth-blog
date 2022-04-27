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

router
  .route("/:id")
  .get(async (req, res) => {
    const blog = await BlogModel.findById(req.params.id);
    res.render("../views/blog.ejs", { blog, session: req.session });
  })
  .post(async (req, res) => {
    const { content, author, isOP, authorID } = req.body;
    const date = new Date();
    const blog = await BlogModel.findById(req.params.id);
    blog.comments.push({ content, author, date, isOP, authorID });
    await blog.save();
    res.redirect("/blog/" + req.params.id);
  });

router.get("/delete/:id", (req, res) => {
  if (req.session.username === "admin") {
    BlogModel.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  res.redirect("/");
});

router.get("/delete/:id/:commentID", (req, res) => {
  if (req.session.username === "admin") {
    BlogModel.findById(req.params.id, (err, blog) => {
      if (err) {
        console.log(err);
      } else {
        blog.comments.id(req.params.commentID).remove();
        blog.save();
      }
    });
  }
  res.redirect("/blog/" + req.params.id);
});

module.exports = router;
