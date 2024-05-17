// library.js
const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming the User model has been defined
    required: true
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]
});

module.exports = mongoose.model("Library", librarySchema);
