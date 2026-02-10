const Student = require('../models/Student');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');

const getStudentsByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const numericTeacherId = parseInt(teacherId);

        if (isNaN(numericTeacherId)) {
            return res.status(400).json({ message: 'Invalid Teacher ID' });
        }

        // 1. Get teacher profile to get their name for timetable lookup
        const teacherProfile = await Teacher.findById(numericTeacherId);
        if (!teacherProfile) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }

        const teacherFullName = `${teacherProfile.firstName} ${teacherProfile.lastName}`;

        // 2. Find all classes where this teacher is assigned
        // Use case-insensitive regex for teacher name in timetable
        const assignedClasses = await Class.find({
            $or: [
                { classTeacher: numericTeacherId },
                { "timetable.teacher": { $regex: new RegExp(`^${teacherFullName}$`, 'i') } }
            ]
        })
            .populate('students')
            .lean();

        if (!assignedClasses || assignedClasses.length === 0) {
            return res.json([]);
        }

        // 3. Fetch students for all these classes
        const allStudentIds = new Set();
        const classConditions = [];

        assignedClasses.forEach(cls => {
            if (cls.students && Array.isArray(cls.students)) {
                cls.students.forEach(id => allStudentIds.add(id));
            }

            classConditions.push({
                CurrentClass: { $regex: new RegExp(`^${cls.name}$`, 'i') },
                section: { $regex: new RegExp(`^${cls.section}$`, 'i') }
            });
        });

        const students = await Student.find({
            $or: [
                { _id: { $in: Array.from(allStudentIds) } },
                ...classConditions
            ],
            status: { $in: ['approved', 'active'] } // Only show approved or active students
        })
            .populate('user', 'name email profileImage')
            .lean();

        // 4. Format the response to include class information for the frontend
        const formattedStudents = students.map(student => {
            // Find which class this student belongs to
            const studentClass = assignedClasses.find(cls =>
                (cls.students && cls.students.some(sId => sId === student._id)) ||
                (student.CurrentClass === cls.name && student.section === cls.section)
            );

            return {
                id: student._id,
                name: `${student.FirstName} ${student.LastName}`,
                rollNo: student.RollNo || student.rollNumber || 'N/A',
                class: studentClass ? `${studentClass.name}${studentClass.section ? ' ' + studentClass.section : ''}` : 'Unknown',
                classId: studentClass?._id,
                email: student.user?.email || student.email || 'N/A',
                phone: student.GuardianContactNo || student.contactNumber || 'N/A',
                attendance: student.attendance && student.attendance.length > 0
                    ? Math.round((student.attendance.filter(r => r.status === 'present').length / student.attendance.length) * 100)
                    : 0,
                performance: 0, // Placeholder as performance logic is not yet implemented
                status: student.status || 'active',
                image: student.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.FirstName || 'S')}+${encodeURIComponent(student.LastName || '')}&background=3b82f6&color=fff`
            };
        });

        res.json(formattedStudents);
    } catch (error) {
        console.error('Error in getStudentsByTeacher:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getStudentsByClass = async (req, res) => {
    try {
        const { className, section } = req.query;

        if (!className || !section) {
            return res.status(400).json({ message: 'ClassName and Section are required' });
        }

        // Search for students matching the class name and section strings
        const students = await Student.find({
            CurrentClass: className,
            section: section,
            status: { $in: ['approved', 'active'] } // Only show approved or active students
        }).sort({ RollNo: 1 }).lean();

        const formattedStudents = students.map(s => ({
            id: s._id,
            name: `${s.FirstName} ${s.LastName}`,
            rollNo: s.RollNo || s.rollNumber || 'N/A',
            status: 'present' // Default status for UI
        }));

        res.json(formattedStudents);
    } catch (error) {
        console.error('Error in getStudentsByClass:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const markAttendance = async (req, res) => {
    try {
        const { attendanceData, date } = req.body;

        if (!attendanceData || !Array.isArray(attendanceData) || !date) {
            return res.status(400).json({ message: 'Missing attendance data or date' });
        }

        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);

        const promises = attendanceData.map(async (record) => {
            const searchDateStart = new Date(date);
            searchDateStart.setHours(0, 0, 0, 0);
            const searchDateEnd = new Date(date);
            searchDateEnd.setHours(23, 59, 59, 999);

            // 1. Try to update existing attendance record for this exact date
            const result = await Student.updateOne(
                {
                    _id: record.studentId,
                    "attendance.date": { $gte: searchDateStart, $lte: searchDateEnd }
                },
                {
                    $set: { "attendance.$.status": record.status }
                }
            );

            // 2. If no record was updated (matched), push a new attendance entry
            if (result.matchedCount === 0) {
                await Student.updateOne(
                    { _id: record.studentId },
                    {
                        $push: {
                            attendance: {
                                date: searchDateStart,
                                status: record.status
                            }
                        }
                    }
                );
            }
        });

        await Promise.all(promises);
        res.json({ message: 'Attendance marked successfully' });
    } catch (error) {
        console.error('Error in markAttendance:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({})
            .populate('user', 'name email profileImage')
            .populate('class', 'name')
            .sort({ RollNo: 1 })
            .lean();
        res.json(students);
    } catch (error) {
        console.error('Error in getAllStudents:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Promote students to next class
// @route   PUT /api/students/promote
// @access  Private
const promoteStudents = async (req, res) => {
    try {
        const { studentIds, targetClass } = req.body;

        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({ message: 'No students selected for promotion' });
        }

        if (!targetClass) {
            return res.status(400).json({ message: 'Target class is required' });
        }

        // Update students
        const result = await Student.updateMany(
            { _id: { $in: studentIds } },
            {
                $set: {
                    CurrentClass: targetClass,
                    // Optionally update AdmissionClass if tracking history, but usually CurrentClass is enough
                }
            }
        );

        res.json({
            message: `Successfully promoted ${result.modifiedCount} student(s) to ${targetClass}`,
            count: result.modifiedCount
        });

    } catch (error) {
        console.error('Error promoting students:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAllStudents,
    getStudentsByTeacher,
    getStudentsByClass,
    markAttendance,
    promoteStudents
};
