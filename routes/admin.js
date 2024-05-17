// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { createLibrary } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth.js');

// Route for creating a library (accessible to admins only)
router.post("/libraries", adminAuth, createLibrary);

// // Route for creating a seller (accessible to admins only)
// router.post("/sellers", adminAuth, createSeller);

module.exports = router;
