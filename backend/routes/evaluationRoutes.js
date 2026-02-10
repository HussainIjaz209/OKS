const express = require('express');
const router = express.Router();
const {
    submitEvaluation,
    getStudentEvaluations,
    getTeacherEvaluations
} = require('../controllers/evaluationController');

router.post('/', submitEvaluation);
router.get('/student/:studentId', getStudentEvaluations);
router.get('/teacher/:teacherId', getTeacherEvaluations);

module.exports = router;
