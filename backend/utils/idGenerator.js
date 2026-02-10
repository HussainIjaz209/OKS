const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

/**
 * Generates the next unique numeric ID across User, Student, and Teacher collections.
 * This ensures no ID collisions occur between these entities.
 * @returns {Promise<number>} The next available ID.
 */
const getNextId = async () => {
    try {
        const [maxUser, maxStudent, maxTeacher] = await Promise.all([
            User.findOne({ _id: { $type: "number" } }).sort({ _id: -1 }).limit(1).lean(),
            Student.findOne({ _id: { $type: "number" } }).sort({ _id: -1 }).limit(1).lean(),
            Teacher.findOne({ _id: { $type: "number" } }).sort({ _id: -1 }).limit(1).lean()
        ]);

        const currentMaxId = Math.max(
            maxUser ? (maxUser._id || 0) : 0,
            maxStudent ? (maxStudent._id || 0) : 0,
            maxTeacher ? (maxTeacher._id || 0) : 0
        );

        return currentMaxId + 1;
    } catch (error) {
        console.error('Error generating next ID:', error);
        throw error;
    }
};

module.exports = { getNextId };
