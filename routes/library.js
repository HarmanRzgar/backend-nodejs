// libraryRoutes.js
const express = require('express');
const router = express.Router();

// Import library controller
const libraryController = require('../controllers/libraryController.js');

router.get('/libraries/:libraryId/books', libraryController.getLibraryBooks);
router.get('/libraries/:libraryId/orders', libraryController.getLibraryOrders);
router.post('/create', libraryController.createLibrary);


module.exports = router;
