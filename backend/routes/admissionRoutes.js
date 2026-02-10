const express = require('express');
const router = express.Router();
const {
    createAdmission,
    getAdmissions,
    updateAdmissionStatus,
    deleteAdmission,
} = require('../controllers/admissionController');

router.route('/').post(createAdmission).get(getAdmissions);
router.route('/:id').put(updateAdmissionStatus).delete(deleteAdmission);

module.exports = router;
