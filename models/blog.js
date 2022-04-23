const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: String,
  author: String,
  date: String,
  isOP: Boolean,
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  author: {
    type: String,
    required: true,
    sparse: true,
  },
  comments: {
    type: [commentSchema],
    default: [],
  },
});

module.exports = mongoose.model("Blog", blogSchema);
