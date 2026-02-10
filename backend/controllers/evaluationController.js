const Evaluation = require('../models/Evaluation');
const Student = require('../models/Student');

// @desc    Submit student evaluation
// @route   POST /api/evaluations
// @access  Teacher
exports.submitEvaluation = async (req, res) => {
    try {
        console.log('Submitting evaluation. Body:', JSON.stringify(req.body, null, 2));
        const { studentId, teacherId, classId, term, academicYear, evaluations, overallComments } = req.body;

        if (!studentId || !teacherId) {
            console.error('Missing required fields:', { studentId, teacherId });
            return res.status(400).json({ success: false, message: 'Student ID and Teacher ID are required' });
        }

        const evaluation = await Evaluation.create({
            student: studentId,
            teacher: teacherId,
            class: classId || undefined,
            term,
            academicYear,
            evaluations,
            overallComments
        });

        console.log('Evaluation created successfully:', evaluation._id);

        res.status(201).json({
            success: true,
            data: evaluation
        });
    } catch (error) {
        console.error('Error in submitEvaluation:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get evaluations for a student
// @route   GET /api/evaluations/student/:studentId
// @access  Teacher/Admin/Student
exports.getStudentEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.find({ student: req.params.studentId })
            .populate('teacher', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: evaluations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get evaluations submitted by a teacher
// @route   GET /api/evaluations/teacher/:teacherId
// @access  Teacher
exports.getTeacherEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.find({ teacher: req.params.teacherId })
            .populate('student', 'FirstName LastName RollNo')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: evaluations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
