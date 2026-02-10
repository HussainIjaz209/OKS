const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    uploadMaterial,
    getTeacherMaterials,
    deleteMaterial,
    getStudentMaterials
} = require('../controllers/materialController');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/materials/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

router.post('/', upload.single('file'), uploadMaterial);
router.get('/teacher/:teacherId', getTeacherMaterials);
router.get('/student', getStudentMaterials);
router.delete('/:id', deleteMaterial);

module.exports = router;
