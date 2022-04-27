const express = require("express");
const UserModel = require("../models/user");
const BlogModel = require("../models/blog");

const router = express.Router();

router.use(express.static("views"));

router.get("/:id", (req, res) => {
  UserModel.findById(req.params.id, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      BlogModel.find({ author: user.username }, (err, blogs) => {
        if (err) {
          console.log(err);
        } else {
          res.render("../views/user.ejs", {
            user,
            blogs,
            session: req.session,
          });
        }
      });
    }
  });
});

router.get("/delete/:user_id", async (req, res) => {
  if (req.session.username === "admin") {
    await UserModel.deleteOne({ _id: req.params.user_id });
  }
  res.redirect("/");
});

module.exports = router;
