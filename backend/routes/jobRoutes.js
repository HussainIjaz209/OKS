const express = require('express');
const router = express.Router();
const { submitJobApplication } = require('../controllers/jobController');

router.post('/', submitJobApplication);

module.exports = router;
