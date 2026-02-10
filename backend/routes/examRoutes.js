const express = require('express');
const router = express.Router();
const {
    getMyExams,
    getMyResults,
    createExam,
    getAllExams,
    deleteExam,
    getStudentsForMarkEntry,
    submitResults,
    generateAutoSchedule,
    updateExam,
    getExamResults
} = require('../controllers/examController');

router.get('/my-exams/:userId', getMyExams);
router.get('/my-results/:userId', getMyResults);

// Admin/Teacher Routes
router.get('/', getAllExams);
router.post('/', createExam);
router.delete('/:id', deleteExam);
router.get('/mark-entry/:classId', getStudentsForMarkEntry);
router.get('/results/:examId', getExamResults);
router.get('/teacher/:userId', require('../controllers/examController').getTeacherExams);
router.post('/submit-results', submitResults);
router.post('/generate-auto', generateAutoSchedule);
router.put('/:id', updateExam);

module.exports = router;
