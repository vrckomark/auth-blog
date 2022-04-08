const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.render("../views/login.ejs");
  })
  .post(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.redirect("/register");
    }
    if (!bcrypt.compare(password, user.password)) {
      return res.redirect("/");
    }

    req.session.isAuth = true;
    req.session.username = user.username;
    res.redirect("/");
  });

module.exports = router;
