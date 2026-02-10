const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    createAssignment,
    getTeacherAssignments,
    getClassAssignments,
    deleteAssignment,
    markStudentStatus
} = require('../controllers/assignmentController');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/assignments/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), createAssignment);
router.get('/teacher/:teacherId', getTeacherAssignments);
router.get('/class/:className', getClassAssignments);
router.delete('/:id', deleteAssignment);
router.put('/:id/status', markStudentStatus);

module.exports = router;
