// controllers/adminController.js

const Library = require('../models/library');
const User = require('../models/user');

// Controller method for creating a library
exports.createLibrary = async (req, res, next) => {
  try {
    const { name, location, ownerId } = req.body;

    // Check if the provided ownerId corresponds to an existing user
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(400).json({ message: 'Invalid owner ID' });
    }

    // Update the owner's role to 'seller' if they are not already one
    if (owner.role !== 'seller' && owner.role == 'buyer') {
      owner.role = 'seller';
      await owner.save();
    }

    // Create the library with the provided owner
    const library = await Library.create({ name, location, owner: ownerId });

    res.status(201).json({ message: 'Library created successfully', library });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the library' });
  }
};
