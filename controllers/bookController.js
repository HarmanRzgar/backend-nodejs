// libraryController.js
const Book = require('../models/book.js');

// Add a new book to a library's inventory
exports.addBookToLibrary = async (req, res) => {
  try {
    const { title, author, ISBN, price } = req.body;
    const libraryId = req.params.libraryId;

    // Validate input
    if (!title || !author || !ISBN || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new book document
    const newBook = new Book({
      title,
      author,
      ISBN,
      price,
      library: libraryId // Associate the book with the library
    });

    // Save the new book document to the database
    await newBook.save();

    res.status(201).json({ message: 'Book added to library inventory successfully', book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
