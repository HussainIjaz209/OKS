const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');

// @route   POST /api/auth/login
// @desc    Authenticate user and return user data
// @access  Public
// @route   POST /api/auth/login
// @desc    Authenticate user and return user data
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const loginId = username || email;

        // Validate input
        if (!loginId || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username/email, password, and role'
            });
        }

        let user = null;
        let isDirectMatch = false;

        // 1. Try to find in User collection by username first, then email
        user = await User.findOne({
            $or: [
                { username: loginId },
                { email: loginId }
            ],
            role
        });

        // 2. Fallback to Student collection if not found in User and role is student
        if (!user && role === 'student') {
            const Student = require('../models/Student');
            const student = await Student.findOne({
                $or: [
                    { username: loginId },
                    { email: loginId },
                    { RollNo: !isNaN(loginId) ? loginId : null }
                ]
            }).lean();

            // Check if student status is allowed
            if (student) {
                if (student.status === 'withdrawn') {
                    return res.status(403).json({
                        success: false,
                        message: 'Account has been withdrawn. Please contact administration for assistance.'
                    });
                } else if (student.status === 'pending') {
                    return res.status(403).json({
                        success: false,
                        message: 'Your admission application is currently pending review. You will be able to login once it is approved.'
                    });
                } else if (student.status === 'rejected') {
                    return res.status(403).json({
                        success: false,
                        message: 'Your admission application has been rejected.'
                    });
                }
            }

            if (student && student.password === password) {
                isDirectMatch = true;
                user = {
                    _id: student._id,
                    name: `${student.FirstName} ${student.LastName}`,
                    username: student.username,
                    email: student.email || student.username,
                    role: 'student',
                    profileImage: '',
                    studentId: student._id, // Explicitly set studentId in fallback
                    matchPassword: async () => true
                };
            }
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password if not already verified
        if (!isDirectMatch) {
            const isPasswordValid = await user.matchPassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
        }

        // Check for Teacher approval OR Student withdrawal
        let userStatus = 'active'; // Default for admin/student
        if (role === 'teacher' && user.teacherId) {
            const Teacher = require('../models/Teacher');
            const teacherProfile = await Teacher.findById(user.teacherId);

            if (teacherProfile) {
                userStatus = teacherProfile.status || 'pending';
                // We no longer block login for pending status
                // if (teacherProfile.status !== 'approved') { ... }
            }
        } else if (role === 'student' && user.studentId) {
            // Check student status if logging in via User collection
            const studentProfile = await Student.findById(user.studentId);
            if (studentProfile) {
                if (studentProfile.status === 'withdrawn') {
                    return res.status(403).json({
                        success: false,
                        message: 'Account has been withdrawn. Please contact administration for assistance.'
                    });
                } else if (studentProfile.status === 'pending') {
                    return res.status(403).json({
                        success: false,
                        message: 'Your admission application is currently pending review.'
                    });
                } else if (studentProfile.status === 'rejected') {
                    return res.status(403).json({
                        success: false,
                        message: 'Your admission application has been rejected.'
                    });
                }
            }
        }

        // Return user data
        const idStr = user._id !== undefined && user._id !== null ? String(user._id) : null;
        // Ensure studentId is consistently available
        const studentIdStr = user.studentId !== undefined && user.studentId !== null ? String(user.studentId) : null;

        const responseUser = {
            id: idStr,
            _id: idStr,
            name: user.name || user.username,
            username: user.username,
            email: user.email,
            role: user.role,
            status: userStatus,
            profileImage: user.profileImage || '',
            teacherId: user.teacherId ? String(user.teacherId) : null,
            studentId: studentIdStr || (user.role === 'student' ? idStr : null)
        };

        console.log('Login successful for:', responseUser.username, 'ID:', responseUser.id, 'StudentID:', responseUser.studentId);

        res.json({
            success: true,
            user: responseUser
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// @route   POST /api/auth/setup-student
// @desc    Setup student account after successful admission
// @access  Public
router.post('/setup-student', async (req, res) => {
    try {
        const { studentId, username, password } = req.body;

        if (!studentId || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // 1. Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student record not found'
            });
        }

        // 2. Check if username already taken in User collection
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }

        // 3. Create new User record
        // Use Student ID as User ID for 1:1 mapping
        const newUser = new User({
            _id: student._id, // Syncing IDs
            username,
            password,
            studentId: student._id,
            role: 'student'
        });

        const savedUser = await newUser.save();

        // 4. Update Student record with user reference
        // We only store the user ID to maintain the link. 
        // Credentials live in the users collection.
        student.user = savedUser._id;

        // Remove plain text credentials from Student document if they exist
        // to ensure users collection is the single source of truth for auth
        student.username = undefined;
        student.password = undefined;

        await student.save();

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: savedUser._id,
                username: savedUser.username,
                role: savedUser.role
            }
        });

    } catch (error) {
        console.error('Account setup error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during account setup'
        });
    }
});

module.exports = router;
