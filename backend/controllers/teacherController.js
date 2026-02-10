const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Class = require('../models/Class');

const getTeacherProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const mongoose = require('mongoose');

        // The id param could be the user ID (from login) or the teacher ID
        // We need to handle both. Since our AuthContext uses user ID (which matches _id),
        // we should look up User first to find the linked teacherId.

        // 1. Try finding by User ID
        let teacher = null;

        // Prepare query for User collection (_id is Mixed)
        // Mongoose doesn't auto-cast for Mixed types, so we must manually provide ObjectId if it's one.
        const userQuery = [];

        // Add as-is (might be string username or other)
        userQuery.push({ _id: id });

        // Add as Number if possible
        if (!isNaN(id)) {
            userQuery.push({ _id: parseInt(id) });
        }

        // Add as ObjectId if valid hex
        if (mongoose.Types.ObjectId.isValid(id)) {
            userQuery.push({ _id: new mongoose.Types.ObjectId(id) });
        }

        let user = await User.findOne({ $or: userQuery });

        if (user && user.role === 'teacher' && user.teacherId) {
            teacher = await Teacher.findById(user.teacherId);
        } else {
            // 2. Try finding by Teacher ID directly (fallback)
            // Teacher collection _id is Number. Querying with a non-numeric string will throw CastError.
            if (!isNaN(id)) {
                teacher = await Teacher.findById(parseInt(id));
            }
        }

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }

        res.json(teacher);

    } catch (error) {
        console.error('Error fetching teacher profile:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().select('firstName lastName _id');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTeacherTimetable = async (req, res) => {
    try {
        const { id } = req.params; // teacherId
        const numericId = parseInt(id);

        if (isNaN(numericId)) {
            return res.status(400).json({ message: 'Invalid Teacher ID' });
        }

        // Fetch the teacher profile to get their name
        const teacher = await Teacher.findById(numericId);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }

        const teacherFullName = `${teacher.firstName} ${teacher.lastName}`;

        // Find all classes where the teacher appears in the timetable
        // Use case-insensitive regex for teacher name
        const classes = await Class.find({
            "timetable.teacher": { $regex: new RegExp(`^${teacherFullName}$`, 'i') }
        }).lean();

        // Extract all relevant slots from across all classes
        const teacherSchedule = [];
        classes.forEach(cls => {
            if (cls.timetable && Array.isArray(cls.timetable)) {
                cls.timetable.forEach(slot => {
                    if (slot.teacher && slot.teacher.toLowerCase() === teacherFullName.toLowerCase()) {
                        teacherSchedule.push({
                            ...slot,
                            classId: cls._id,
                            className: `${cls.name} ${cls.section}`,
                            room: cls.room
                        });
                    }
                });
            }
        });

        // Sort by start time
        teacherSchedule.sort((a, b) => a.startTime.localeCompare(b.startTime));

        res.json(teacherSchedule);
    } catch (error) {
        console.error('Error fetching teacher timetable:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getManagedClasses = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const numericId = parseInt(teacherId);

        if (isNaN(numericId)) {
            return res.status(400).json({ message: 'Invalid Teacher ID' });
        }

        const classes = await Class.find({ classTeacher: numericId }).lean();
        res.json(classes);
    } catch (error) {
        console.error('Error in getManagedClasses:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getTeacherSubjects = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { className, section } = req.query;

        const teacher = await Teacher.findById(parseInt(teacherId));
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }

        const teacherFullName = `${teacher.firstName} ${teacher.lastName}`;

        // Build query for class
        const query = { name: { $regex: new RegExp(`^${className}$`, 'i') } };
        if (section && section !== 'undefined') {
            query.section = { $regex: new RegExp(`^${section}$`, 'i') };
        }

        const classes = await Class.find(query).lean();
        const subjects = new Set();

        classes.forEach(cls => {
            if (cls.timetable && Array.isArray(cls.timetable)) {
                cls.timetable.forEach(slot => {
                    if (slot.teacher && slot.teacher.toLowerCase() === teacherFullName.toLowerCase()) {
                        subjects.add(slot.subject);
                    }
                });
            }
        });

        res.json(Array.from(subjects));
    } catch (error) {
        console.error('Error in getTeacherSubjects:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getTeacherProfile, getAllTeachers, getTeacherTimetable, getManagedClasses, getTeacherSubjects };
