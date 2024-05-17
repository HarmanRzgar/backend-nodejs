// book.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  ISBN: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre'
  },
  description: {
    type: String
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
});

module.exports = mongoose.model("Book", bookSchema);
