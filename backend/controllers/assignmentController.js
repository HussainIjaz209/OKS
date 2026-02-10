const Assignment = require('../models/Assignment');
const Class = require('../models/Class');
const Student = require('../models/Student');

// @desc    Create new assignment
// @route   POST /api/assignments
const createAssignment = async (req, res) => {
    try {
        const { title, description, className, section, subject, teacher, dueDate, points } = req.body;
        const file = req.file ? `/uploads/assignments/${req.file.filename}` : null;

        const combinedClassName = section ? `${className} ${section}` : className;

        const assignment = new Assignment({
            title,
            description,
            className: combinedClassName,
            subject,
            teacher,
            dueDate,
            points,
            status: 'active',
            file: file
        });

        const savedAssignment = await assignment.save();
        res.status(201).json(savedAssignment);
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get assignments for a teacher
// @route   GET /api/assignments/teacher/:teacherId
const getTeacherAssignments = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const query = {
            $or: [
                { teacher: teacherId },
                { teacher: !isNaN(teacherId) ? parseInt(teacherId) : null }
            ]
        };
        const assignments = await Assignment.find(query).sort({ createdAt: -1 });
        res.json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Assignment.findByIdAndDelete(id);
        if (!result) return res.status(404).json({ message: 'Assignment not found' });
        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get assignments for a class
// @route   GET /api/assignments/class/:className
const getClassAssignments = async (req, res) => {
    try {
        let { className } = req.params;

        // Normalization: Handle "Grade X" vs "X" variations
        // Also allow matching parent grade for sectioned students, and all sections for unsectioned students
        let normalizedSearch = className.replace(/^Grade\s+/i, '');
        let searchPattern = `^(Grade\\s+)?${normalizedSearch}(\\s+.*)?$`;

        // If it looks like "5 Rose", also allow matching "5" (grade-wide)
        if (normalizedSearch.includes(' ')) {
            const parts = normalizedSearch.split(' ');
            const prefix = parts.slice(0, -1).join(' '); // "5 Rose" -> "5", "Foundation 1 Rose" -> "Foundation 1"
            searchPattern += `|^(Grade\\s+)?${prefix}$`;
        }

        const assignments = await Assignment.find({
            className: { $regex: new RegExp(searchPattern, 'i') }
        }).sort({ dueDate: 1 });
        res.json(assignments);
    } catch (error) {
        console.error('Error fetching class assignments:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Mark student assignment status
// @route   PUT /api/assignments/:id/status
const markStudentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { studentId, status } = req.body;

        const assignment = await Assignment.findById(id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        // Check if student submission already exists
        const submissionIndex = assignment.submissions.findIndex(s => s.student === parseInt(studentId));

        if (submissionIndex > -1) {
            // Update existing status
            assignment.submissions[submissionIndex].status = status;
            assignment.submissions[submissionIndex].markedDate = Date.now();
        } else {
            // Add new submission status
            assignment.submissions.push({
                student: studentId,
                status,
                markedDate: Date.now()
            });
        }

        await assignment.save();
        res.json({ success: true, assignment });
    } catch (error) {
        console.error('Error marking student status:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createAssignment,
    getTeacherAssignments,
    getClassAssignments,
    deleteAssignment,
    markStudentStatus
};
