const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");

const blogRouter = require("./routes/blog.js");

const MongoDBSession = require("connect-mongodb-session")(session);
const UserModel = require("./models/user");
const BlogModel = require("./models/blog");

require("dotenv").config();

const app = express();

const mongoURI = process.env.ATLAS_URI;

//db connection
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("MongoDB connected.");
  });

//kam se stora session VVVV
const store = new MongoDBSession({
  uri: mongoURI,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/blog", blogRouter);

app.set("view engine", "ejs");

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", async (req, res) => {
  const blogs = await BlogModel.find({});
  res.json(blogs);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.redirect("/register");
  }
  if (!bcrypt.compare(password, user.password)) {
    return res.redirect("/login");
  }

  req.session.isAuth = true;
  req.session.username = user.username;
});

app.get("/register", (req, res) => {
  res.send("this is register");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  let user = await UserModel.findOne({ email });
  if (user) {
    return res.redirect("/register");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = new UserModel({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();
  res.redirect("/login");
});

app.get("/dashboard", isAuth, (req, res) => {
  res.send("this is /dashboard");
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
  });
  res.redirect("/");
});

module.exports = app;
