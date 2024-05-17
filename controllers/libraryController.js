// libraryController.js
const Library = require('../models/library.js');

// Get all books owned by a specific library
exports.getLibraryBooks = async (req, res) => {
  try {
    const libraryId = req.params.libraryId;
    const books = await Library.findById(libraryId).populate('books');
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all orders for a specific library
exports.getLibraryOrders = async (req, res) => {
  try {
    const libraryId = req.params.libraryId;
    // Logic to retrieve orders for the library...
    res.json({ message: 'Get library orders' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.createLibrary = async (req, res) => {
  try {
    const { name, location, owner } = req.body;

    // Validate input
    if (!name || !location || !owner) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new library document
    const newLibrary = new Library({
      name,
      location,
      owner
    });

    // Save the new library document to the database
    await newLibrary.save();

    res.status(201).json({ message: 'Library created successfully', library: newLibrary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

