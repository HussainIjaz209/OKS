const Announcement = require('../models/Announcement');

// @desc    Create a new announcement (Teacher/Admin)
// @route   POST /api/announcements
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, audience, priority, className, section, teacherId, authorName, sender } = req.body;

        const newAnnouncement = new Announcement({
            title,
            content,
            audience,
            priority,
            className,
            section,
            teacherId,
            authorName,
            sender
        });

        const savedAnnouncement = await newAnnouncement.save();
        res.status(201).json(savedAnnouncement);
    } catch (error) {
        console.error('Error in createAnnouncement:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get announcements created by a specific teacher
// @route   GET /api/announcements/teacher/:teacherId
const getTeacherAnnouncements = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const announcements = await Announcement.find({ teacherId: parseInt(teacherId) }).sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        console.error('Error in getTeacherAnnouncements:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        await Announcement.findByIdAndDelete(id);
        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Error in deleteAnnouncement:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get announcements for a student (class-specific + global)
// @route   GET /api/announcements/student
const getStudentAnnouncements = async (req, res) => {
    try {
        const { className, section } = req.query;

        // Normalization: Handle "Grade X" vs "X"
        let normalizedSearch = className ? className.replace(/^Grade\s+/i, '') : '';

        // Build a flexible regex pattern for the class name
        // This matches "Grade 5", "5", "Grade 5 Rose", "5 Rose" etc.
        let searchPattern = `^(Grade\\s+)?${normalizedSearch}(\\s+.*)?$`;

        // If the student's class already contains a section (e.g. "5 Rose")
        // we also want to match the base grade (e.g. "5") for grade-wide announcements.
        if (normalizedSearch.includes(' ')) {
            const parts = normalizedSearch.split(' ');
            const prefix = parts.slice(0, -1).join(' '); // "5 Rose" -> "5"
            searchPattern += `|^(Grade\\s+)?${prefix}$`;
        }

        const sectionQuery = (section === 'Not Assigned' || !section)
            ? {} // If student has no section, don't filter by section (match all sections in that grade)
            : {
                $or: [
                    { section: section },
                    { section: '' },
                    { section: { $exists: false } },
                    { section: 'Not Assigned' }
                ]
            };

        const announcements = await Announcement.find({
            $or: [
                { audience: 'all' },
                { audience: 'students' },
                {
                    audience: 'class',
                    className: { $regex: new RegExp(searchPattern, 'i') },
                    ...sectionQuery
                }
            ]
        }).sort({ createdAt: -1 });

        res.json(announcements);
    } catch (error) {
        console.error('Error in getStudentAnnouncements:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createAnnouncement,
    getTeacherAnnouncements,
    getStudentAnnouncements,
    deleteAnnouncement
};
