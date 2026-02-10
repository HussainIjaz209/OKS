const express = require('express');
const router = express.Router();
const {
    createAnnouncement,
    getTeacherAnnouncements,
    getStudentAnnouncements,
    deleteAnnouncement
} = require('../controllers/announcementController');

// @route   POST /api/announcements
// @desc    Create a new announcement
router.post('/', createAnnouncement);

// @route   GET /api/announcements/teacher/:teacherId
// @desc    Get announcements created by a specific teacher
router.get('/teacher/:teacherId', getTeacherAnnouncements);

// @route   GET /api/announcements/student
// @desc    Get announcements for students
router.get('/student', getStudentAnnouncements);

// @route   DELETE /api/announcements/:id
// @desc    Delete an announcement
router.delete('/:id', deleteAnnouncement);

module.exports = router;
