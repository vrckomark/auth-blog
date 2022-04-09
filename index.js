const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const blogRouter = require("./routes/blog.js");
const loginRouter = require("./routes/login.js");
const registerRouter = require("./routes/register.js");

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

app.use(express.static("./views"));
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
app.use("/login", loginRouter);
app.use("/register", registerRouter);

app.set("view engine", "ejs");

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", async (req, res) => {
  const session = req.session;
  const blogs = await BlogModel.find({});
  res.render(path.join(__dirname, "views", "index.ejs"), { blogs, session });
});

app.get("/deleteUsers", (req, res) => {
  if (req.session.username === "admin") {
    UserModel.deleteMany({ username: { $ne: "admin" } }, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Users deleted.");
      }
    });
  }
  res.redirect("/");
});

app.get("/deleteBlogs", (req, res) => {
  if (req.session.username === "admin") {
    BlogModel.deleteMany({}, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Blogs deleted.");
      }
    });
  }
  res.redirect("/");
});

app.get("/dashboard", isAuth, async (req, res) => {
  const users = await UserModel.find({});
  res.render(path.join(__dirname, "views", "dashboard.ejs"), {
    session: req.session,
    users,
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
  });
  res.redirect("/");
});

// app.listen(5000, () => {
//   {
//     console.log("server is running on port 5000");
//   }
// });

module.exports = app;
