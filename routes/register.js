const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.render("../views/register.ejs", { session: req.session });
  })
  .post(async (req, res) => {
    const { username, email, password } = req.body;

    let user = await UserModel.findOne({ email });
    if (user) {
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

    user = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.redirect("/login");
  });

module.exports = router;
