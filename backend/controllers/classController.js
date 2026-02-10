const Class = require('../models/Class');

// Predefined Subjects Logic
const getSubjectsForClass = (className) => {
    // Normalizing class name checking
    const name = className.toLowerCase().replace('-', ' ').replace('grade ', '');

    if (['play group', 'foundation 1', 'foundation 2'].includes(name)) {
        return ['English', 'English Oral', 'Urdu', 'Urdu Oral', 'Math', 'Math Oral', 'Nazira'];
    }

    // Grades 1-3
    if (['1', '2', '3'].includes(name)) {
        return ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamiyat', 'Nazira'];
    }

    // Grades 4-7
    if (['4', '5', '6', '7'].includes(name)) {
        return ['English', 'Urdu', 'Math', 'Science', 'Islamiyat', 'Social Studies', 'Nazira'];
    }

    return []; // Default empty
};

const seedClasses = async () => {
    const classesToSeed = [
        'Play Group', 'Foundation 1', 'Foundation 2',
        'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'
    ];

    try {
        const count = await Class.countDocuments();
        if (count > 0) {
            console.log("Classes already exist, skipping seed.");
            return;
        }

        for (const className of classesToSeed) {
            const existingClass = await Class.findOne({ name: className });
            if (!existingClass) {
                await Class.create({
                    name: className,
                    section: 'A', // Default section
                    subjects: getSubjectsForClass(className),
                    timetable: [],
                    students: []
                });
                console.log(`Seeded class: ${className}`);
            } else {
                // Determine if we should update subjects (in case requirements changed)
                // Checking if subjects need update
                const expectedSubjects = getSubjectsForClass(className);
                // Simple check if length differs or if user wants us to force update. 
                // Let's force update subjects to ensure compliance with user request
                if (JSON.stringify(existingClass.subjects) !== JSON.stringify(expectedSubjects)) {
                    existingClass.subjects = expectedSubjects;
                    await existingClass.save();
                    console.log(`Updated subjects for: ${className}`);
                }
            }
        }
    } catch (error) {
        console.error("Error seeding classes:", error);
    }
};

const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find().populate('classTeacher', 'firstName lastName');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createClass = async (req, res) => {
    try {
        const classData = { ...req.body };
        // If classTeacher is an empty string, remove it to avoid ObjectId casting error
        if (classData.classTeacher === '') {
            delete classData.classTeacher;
        }

        const newClass = new Class(classData);
        // Auto-assign subjects based on name if not provided
        if (!newClass.subjects || newClass.subjects.length === 0) {
            newClass.subjects = getSubjectsForClass(newClass.name);
        }
        await newClass.save();
        res.status(201).json(newClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const { timetable } = req.body;

        const updatedClass = await Class.findByIdAndUpdate(
            id,
            { timetable },
            { new: true }
        );

        if (!updatedClass) return res.status(404).json({ message: 'Class not found' });

        res.json(updatedClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const classData = { ...req.body };

        // Handle empty string for classTeacher
        if (classData.classTeacher === '') {
            classData.classTeacher = null;
        }

        const updatedClass = await Class.findByIdAndUpdate(
            id,
            classData,
            { new: true }
        ).populate('classTeacher', 'firstName lastName');

        if (!updatedClass) return res.status(404).json({ message: 'Class not found' });

        res.json(updatedClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        await Class.findByIdAndDelete(id);
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getClassByStudentId = async (req, res) => {
    try {
        const studentId = req.params.studentId;

        if (!studentId || studentId === 'null' || studentId === 'undefined') {
            return res.status(400).json({ message: 'Invalid student ID provided' });
        }

        const Student = require('../models/Student');
        const Class = require('../models/Class');
        const student = await Student.findOne({
            $or: [{ user: req.params.studentId }, { _id: req.params.studentId }]
        }).populate('class');

        if (!student) return res.status(404).json({ message: 'Student not found' });

        let targetClass = student.class;

        // Fallback: search by class name if reference is missing
        if (!targetClass && student.CurrentClass) {
            const className = student.CurrentClass;
            const normalizedClassName = student.CurrentClass.toLowerCase().includes('grade') ? student.CurrentClass : `Grade ${student.CurrentClass}`;

            targetClass = await Class.findOne({
                $or: [{ name: className }, { name: normalizedClassName }],
                section: student.section
            }) || await Class.findOne({
                $or: [{ name: className }, { name: normalizedClassName }]
            });

            // Auto-heal: If found, update the student record with the reference
            if (targetClass) {
                student.class = targetClass._id;
                await student.save();
            }
        }

        if (!targetClass) return res.status(400).json({ message: 'Student not assigned to a class' });

        res.json(targetClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllClasses, createClass, updateClass, updateTimetable, deleteClass, seedClasses, getClassByStudentId };
