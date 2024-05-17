// bookRoutes.js
const express = require('express');
const router = express.Router();

// Import book controller
const bookController = require('../controllers/bookController.js');

router.post('/libraries/:libraryId/create', bookController.addBookToLibrary);

module.exports = router;
