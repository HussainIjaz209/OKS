const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contactController');

// @route   POST /api/contact
// @access  Public
router.post('/', sendContactEmail);

module.exports = router;
