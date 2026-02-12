const Teacher = require('../models/Teacher');
const User = require('../models/User');
const { hashSHA256 } = require('../utils/hashUtils');

const submitJobApplication = async (req, res) => {
    try {
        const {
            firstName, lastName, fatherName, dateOfBirth, gender, maritalStatus,
            city, whatsappNumber, email, degreeTitle, subjectMajor,
            universityBoard, passingYear, gradeCGPA, totalExperience,
            username, password
        } = req.body;

        console.log('Received Job Application:', req.body);

        // Check if username or email already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        // Generate IDs
        // For User - Use centralized ID generator
        const { getNextId } = require('../utils/idGenerator');
        const newUserId = await getNextId();

        // For Teacher
        const lastTeacher = await Teacher.findOne().sort({ _id: -1 }).lean();
        console.log('Last Teacher Found:', lastTeacher);
        let newTeacherId = 1;
        if (lastTeacher && lastTeacher._id) {
            newTeacherId = Number(lastTeacher._id) + 1;
        }

        console.log('Generated IDs - User:', newUserId, 'Teacher:', newTeacherId);

        // Create User
        // Note: In a real app, hash password. Here storing plain as per existing pattern evident in User.js
        const user = await User.create({
            _id: newUserId,
            username,
            password: hashSHA256(password), // Hashed!
            role: 'teacher',
            teacherId: newTeacherId
        });

        // Create Teacher
        const newTeacher = new Teacher({
            _id: newTeacherId,
            user: newUserId,
            firstName,
            lastName,
            fatherName,
            dateOfBirth,
            gender,
            maritalStatus,
            city,
            whatsappNumber,
            email,
            degreeTitle,
            subjectMajor,
            universityBoard,
            passingYear,
            gradeCGPA,
            totalExperience
        });

        await newTeacher.save();

        res.status(201).json({
            message: 'Application Submitted Successfully',
            user: {
                _id: user._id,
                username: user.username,
                role: user.role
            },
            teacher: {
                _id: newTeacher._id,
                firstName: newTeacher.firstName,
                lastName: newTeacher.lastName
            }
        });

    } catch (error) {
        console.error('Job Application Error:', error);
        if (error.code === 121 && error.errInfo) {
            console.error('Validation Details:', JSON.stringify(error.errInfo, null, 2));
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { submitJobApplication };
