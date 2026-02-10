const express = require('express');
const router = express.Router();
const { getTeacherProfile, getAllTeachers, getTeacherTimetable, getManagedClasses, getTeacherSubjects } = require('../controllers/teacherController');
const { getStudentsByTeacher } = require('../controllers/studentController');

// @route   GET /api/teachers
// @desc    Get all teachers
// @access  Private
router.get('/', getAllTeachers);

// @route   GET /api/teachers/profile/:id
// @desc    Get teacher profile by ID (User ID or Teacher ID)
// @access  Private (should be protected in a real app)
router.get('/profile/:id', getTeacherProfile);

// @route   GET /api/teachers/:teacherId/students
// @desc    Get students for a teacher's assigned classes
// @access  Private
router.get('/:teacherId/students', getStudentsByTeacher);

// @route   GET /api/teachers/timetable/:id
// @desc    Get teacher's aggregated timetable
// @access  Private
router.get('/timetable/:id', getTeacherTimetable);

// @route   GET /api/teachers/managed-classes/:teacherId
// @desc    Get classes managed by a teacher (where they are Class Teacher)
// @access  Private
router.get('/managed-classes/:teacherId', getManagedClasses);

// @route   GET /api/teachers/:teacherId/subjects
// @desc    Get subjects taught by a teacher in a class
// @access  Private
router.get('/:teacherId/subjects', getTeacherSubjects);

module.exports = router;
