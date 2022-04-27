const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.render("../views/login.ejs", { session: req.session });
  })
  .post(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.redirect("/register");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid || password === "") {
      return res.redirect("/login");
    }

    req.session.isAuth = true;
    req.session.username = user.username;
    req.session.userid = user._id;
    req.session.email = user.email;
    res.redirect("/");
  });

module.exports = router;
