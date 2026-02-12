const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { getAllStudents, getStudentsByClass, markAttendance, promoteStudents } = require('../controllers/studentController');

// @route   GET /api/students
// @desc    Get all students
// @access  Private
router.get('/', getAllStudents);

// @route   GET /api/students/profile/:userId
// @desc    Get student profile by user ID
// @access  Private (should add auth middleware later)
router.get('/profile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId || userId === 'null' || userId === 'undefined') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID. This may happen if your session is corrupted. Please try logging out and back in.'
            });
        }

        let student = null;

        // console.log('Fetching profile for userId:', userId);

        // Search Strategy:
        // 1. First try to find by the linked 'user' field (handles both numeric and ObjectId users)
        student = await Student.findOne({ user: userId })
            .populate('user', 'username name email profileImage')
            .populate('class', 'name')
            .lean();

        // 2. If not found by 'user' reference, try numeric lookups if userId is a number
        if (!student) {
            const numericId = parseInt(userId);
            if (!isNaN(numericId) && numericId.toString() === userId.toString()) {
                // Try finding by _id as number
                student = await Student.findOne({ _id: numericId })
                    .populate('class', 'name')
                    .lean();

                // 3. Fallback to RollNo if not found by _id
                if (!student) {
                    student = await Student.findOne({ RollNo: numericId })
                        .populate('class', 'name')
                        .lean();
                }
            }
        }

        // 4. Final attempt: Try direct string ID (for ObjectId or custom string IDs)
        if (!student) {
            student = await Student.findOne({ _id: userId })
                .populate('class', 'name')
                .lean()
                .catch(() => null);
        }

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if student status is allowed to view profile
        const allowedStatuses = ['approved', 'active'];
        if (student.status && !allowedStatuses.includes(student.status.toLowerCase())) {
            let message = 'Your admission is currently pending review.';
            if (student.status.toLowerCase() === 'rejected') {
                message = 'Your admission application has been rejected.';
            } else if (student.status.toLowerCase() === 'withdrawn') {
                message = 'Your student account has been withdrawn.';
            }
            return res.status(403).json({
                message,
                status: student.status
            });
        }

        // Calculate attendance percentage
        let attendancePercentage = '0%';
        if (student.attendance && student.attendance.length > 0) {
            const presentDays = student.attendance.filter(
                record => record.status === 'present' || record.status === 'late'
            ).length;
            const totalDays = student.attendance.length;
            attendancePercentage = `${Math.round((presentDays / totalDays) * 100)}%`;
        }

        // Determine user data source (User model or direct Student model)
        const userName = (student.user && student.user.name)
            ? student.user.name
            : `${student.FirstName || ''} ${student.LastName || ''}`.trim();

        const userEmail = (student.user && student.user.email)
            ? student.user.email
            : (student.email || student.username || student.GuardianEmail || 'N/A');

        const userProfileImage = student.profilePicture
            ? `http://localhost:5000/uploads/${student.profilePicture}`
            : ((student.user && student.user.profileImage) ? student.user.profileImage : '');

        // Format the response
        const profileData = {
            studentId: student._id,
            name: userName,
            profileImage: userProfileImage,
            rollNumber: student.RollNo || student.rollNumber,
            class: student.class ? student.class.name : (student.CurrentClass || student.AdmissionClass || 'Not Assigned'),
            lastName: student.LastName,
            section: student.section || 'Not Assigned',
            fatherName: student.FatherName || student.fatherName || student.GuardianName || 'N/A', // Unified mapping
            email: student.email || student.user?.email || 'N/A',
            motherName: student.motherName || 'N/A',
            dateOfBirth: student.DateOfBirth || student.dateOfBirth,
            contactNumber: student.contactNumber || student.GuardianContactNo || 'N/A',
            address: student.address || student.PresentAddress || 'N/A',
            attendance: attendancePercentage,
            assignments: student.assignments || [],
            fees: student.fees || []
        };

        res.json(profileData);
    } catch (error) {
        console.error('Error fetching student profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/students/class-students
// @desc    Get students by class name and section
// @access  Private
router.get('/class-students', getStudentsByClass);

// @route   POST /api/students/attendance
// @desc    Mark attendance for multiple students
// @access  Private
router.post('/attendance', markAttendance);

// @route   PUT /api/students/promote
// @desc    Promote students to next class
// @access  Private
router.put('/promote', promoteStudents);

module.exports = router;
