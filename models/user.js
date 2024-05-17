// user.js
const Mongoose = require("mongoose");

const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["buyer", "seller", "admin"],
    default: "buyer",
    required: true
  },
  cart: [{
    book: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  }],
  wishlist: [{
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]
});

const User = Mongoose.model("user", UserSchema);
module.exports = User;
