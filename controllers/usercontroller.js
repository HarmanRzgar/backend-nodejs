const Order = require("../models/order");
const User = require("../models/user");
const Book = require("../models/book");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ Message: error.message });
  }
};

// Get user's cart
const getUserCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    console.log("hi");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's cart
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const purchaseBook = async (req, res) => {
  try {
    const { userId, bookId, quantity } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the book by ID
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Calculate total amount
    const totalAmount = book.price * quantity;

    // Create a new order
    const order = new Order({
      user: userId,
      items: [{ book: bookId, quantity }],
      totalAmount,
      status: "pending",
    });

    // Save the order to the database
    await order.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all orders associated with the user ID
    const orders = await Order.find({ user: userId });

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a book to the user's cart
const addBookToCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { bookId, quantity } = req.body;

    // Validate input
    if (!bookId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the book is already in the cart
    const existingCartItemIndex = user.cart.findIndex(
      (item) => item.book.toString() === bookId
    );

    if (existingCartItemIndex !== -1) {
      // If the book is already in the cart, update the quantity
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // If the book is not in the cart, add it
      user.cart.push({ book: bookId, quantity });
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Book added to cart successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const purchaseCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve the user's cart items
    const cartItems = user.cart;

    // Create order items array
    const orderItems = cartItems.map((cartItem) => ({
      book: cartItem.book,
      quantity: cartItem.quantity,
    }));

    // Calculate total amount
    const totalAmount = cartItems.reduce((total, cartItem) => {
      const bookPrice = cartItem.book.price; // Assuming each book has a 'price' field
      return total + bookPrice * cartItem.quantity;
    }, 0);

    // Create a new order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      status: "pending",
    });

    // Save the order to the database
    await order.save();

    // Optionally, remove purchased items from the user's cart
    user.cart = [];
    await user.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUsers,
  getUserCart,
  getUserOrders,
  addBookToCart,
  purchaseBook,
  purchaseCart,
};
