const express = require('express');
const router = express.Router();
const { getAllClasses, createClass, updateClass, updateTimetable, deleteClass, getClassByStudentId } = require('../controllers/classController');

router.get('/', getAllClasses);
router.post('/', createClass);
router.get('/student/:studentId', getClassByStudentId);
router.put('/:id', updateClass);
router.put('/:id/timetable', updateTimetable);
router.delete('/:id', deleteClass);

module.exports = router;
