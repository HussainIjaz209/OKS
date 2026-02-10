const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllUsers, updateUserStatus, updateUserDetails, deleteUser, createAdmin, updateCredentials } = require('../controllers/userController');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

router.get('/', getAllUsers);
router.post('/', createAdmin);
router.put('/:id/status', updateUserStatus);
router.put('/:id/details', upload.single('profilePicture'), updateUserDetails);
router.put('/:id/credentials', updateCredentials);
router.delete('/:id', deleteUser);

module.exports = router;
