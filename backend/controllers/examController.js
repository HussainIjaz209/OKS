const Exam = require('../models/Exam');
const Result = require('../models/Result');
const Student = require('../models/Student');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const User = require('../models/User');

const calculateDuration = (start, end) => {
    if (!start || !end) return '0h';
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    let totalMinutes = (eH * 60 + eM) - (sH * 60 + sM);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`.trim();
};

// @desc    Get exams for logged in student's class
// @route   GET /api/exams/my-exams/:userId
exports.getMyExams = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const lookupId = mongoose.Types.ObjectId.isValid(req.params.userId)
            ? new mongoose.Types.ObjectId(req.params.userId)
            : req.params.userId;

        const student = await Student.findOne({
            $or: [{ user: lookupId }, { _id: lookupId }]
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Fallback: search by class name if reference is missing
        if (!student.class && student.CurrentClass) {
            const className = student.CurrentClass;
            const normalizedClassName = className.toLowerCase().includes('grade') ? className : `Grade ${className}`;

            const targetClass = await Class.findOne({
                $or: [{ name: className }, { name: normalizedClassName }],
                section: student.section
            }) || await Class.findOne({
                $or: [{ name: className }, { name: normalizedClassName }]
            });

            if (targetClass) {
                student.class = targetClass._id;
                await student.save();
            }
        }

        if (!student.class) {
            return res.status(400).json({ success: false, message: 'Student not assigned to a class' });
        }

        const exams = await Exam.find({ class: student.class }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: exams.length, data: exams });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get results for logged in student
// @route   GET /api/exams/my-results/:userId
exports.getMyResults = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const lookupId = mongoose.Types.ObjectId.isValid(req.params.userId)
            ? new mongoose.Types.ObjectId(req.params.userId)
            : req.params.userId;

        const student = await Student.findOne({
            $or: [{ user: lookupId }, { _id: lookupId }]
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Fallback: search by class name if reference is missing
        if (!student.class && student.CurrentClass) {
            const className = student.CurrentClass;
            const normalizedClassName = className.toLowerCase().includes('grade') ? className : `Grade ${className}`;

            const targetClass = await Class.findOne({
                $or: [{ name: className }, { name: normalizedClassName }],
                section: student.section
            }) || await Class.findOne({
                $or: [{ name: className }, { name: normalizedClassName }]
            });

            if (targetClass) {
                student.class = targetClass._id;
                await student.save();
            }
        }

        const results = await Result.find({ student: student._id })
            .populate('exam', 'title term ')
            .populate({
                path: 'student',
                populate: { path: 'class', select: 'name' }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: results.length, data: results });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create new exam
// @route   POST /api/exams
exports.createExam = async (req, res) => {
    try {
        const exam = await Exam.create(req.body);
        res.status(201).json({ success: true, data: exam });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all exams (for Admin)
// @route   GET /api/exams
exports.getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate('class', 'name section').sort({ date: -1 });
        res.status(200).json({ success: true, data: exams });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
exports.deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
        res.status(200).json({ success: true, message: 'Exam deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get students for mark entry
// @route   GET /api/exams/mark-entry/:classId
exports.getStudentsForMarkEntry = async (req, res) => {
    try {
        const classId = req.params.classId;
        const targetClass = await Class.findById(classId);

        if (!targetClass) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        const students = await Student.find({
            $or: [
                { class: classId },
                {
                    CurrentClass: targetClass.name,
                    section: targetClass.section
                }
            ]
        }).select('_id FirstName LastName RollNo').sort({ RollNo: 1 });

        res.status(200).json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Submit marks for students
// @route   POST /api/exams/submit-results
exports.submitResults = async (req, res) => {
    try {
        const { examId, results } = req.body; // results is an array of { studentId, marks: [{subject, obtainedMarks, totalMarks}] }

        const submissionPromises = results.map(async (resData) => {
            const { studentId, marks } = resData;

            // Calculate totals
            const totalObtained = marks.reduce((acc, m) => acc + (m.obtainedMarks || 0), 0);
            const totalMax = marks.reduce((acc, m) => acc + (m.totalMarks || 0), 0);
            const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : 0;

            // Simple grading logic
            let overallGrade = 'F';
            if (percentage >= 80) overallGrade = 'A';
            else if (percentage >= 70) overallGrade = 'B';
            else if (percentage >= 60) overallGrade = 'C';
            else if (percentage >= 50) overallGrade = 'D';

            const resultStatus = percentage >= 40 ? 'Pass' : 'Fail';

            return Result.findOneAndUpdate(
                { exam: examId, student: studentId },
                {
                    marks,
                    totalObtained,
                    totalMax,
                    percentage,
                    overallGrade,
                    resultStatus
                },
                { upsert: true, new: true }
            );
        });

        await Promise.all(submissionPromises);
        res.status(200).json({ success: true, message: 'Results submitted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get results for an exam
// @route   GET /api/exams/results/:examId
exports.getExamResults = async (req, res) => {
    try {
        const results = await Result.find({ exam: req.params.examId });
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get exams for classes a teacher is involved in
// @route   GET /api/exams/teacher/:userId
exports.getTeacherExams = async (req, res) => {
    try {
        const userId = req.params.userId;

        const mongoose = require('mongoose');
        const lookupId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;

        // 1. Find teacher profile
        const user = await User.findById(lookupId);
        if (!user || user.role !== 'teacher' || !user.teacherId) {
            return res.status(404).json({ success: false, message: 'Teacher profile not found' });
        }

        const teacher = await Teacher.findById(user.teacherId);
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher data not found' });
        }

        const teacherFullName = `${teacher.firstName} ${teacher.lastName}`.trim();
        const teacherFirstName = teacher.firstName.trim();
        const teacherLastName = teacher.lastName.trim();

        // 2. Find classes where teacher is Class Teacher OR in Timetable
        // We use a more inclusive search for the teacher name in the timetable
        const assignedClasses = await Class.find({
            $or: [
                { classTeacher: teacher._id },
                {
                    "timetable.teacher": {
                        $regex: new RegExp(`^${teacherFullName}$|^${teacherFirstName}\\s+${teacherLastName}$`, 'i')
                    }
                }
            ]
        }).select('_id');

        const classIds = assignedClasses.map(c => c._id);

        // 3. Find exams for these classes
        const exams = await Exam.find({ class: { $in: classIds } })
            .populate('class', 'name section classTeacher timetable')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: exams.length, data: exams });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// @desc    Generate automatic exam schedule for all classes
// @route   POST /api/exams/generate-auto
exports.generateAutoSchedule = async (req, res) => {
    try {
        let { title, term, startDate, startTime, endTime } = req.body;

        if (!title || !term || !startDate || !startTime) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // Default end time to +3 hours if not provided
        if (!endTime) {
            const [h, m] = startTime.split(':').map(Number);
            const endH = (h + 3) % 24;
            endTime = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        }

        const classes = await Class.find();
        if (classes.length === 0) {
            return res.status(400).json({ success: false, message: 'No classes found to generate schedule for' });
        }

        const generatedExams = [];
        const teacherDailyCount = {}; // { "YYYY-MM-DD": { "TeacherName": count } }

        // Helper to get next available date (skipping Sundays)
        const getNextDate = (currentDate) => {
            const next = new Date(currentDate);
            next.setDate(next.getDate() + 1);
            if (next.getDay() === 0) { // Sunday
                next.setDate(next.getDate() + 1);
            }
            return next;
        };

        // Helper to check teacher availability
        const isTeacherAvailable = (dateStr, teacherName) => {
            if (!teacherName) return true; // Generic subject without assigned teacher
            if (!teacherDailyCount[dateStr]) teacherDailyCount[dateStr] = {};
            const count = teacherDailyCount[dateStr][teacherName] || 0;
            return count < 2; // Allow max 2 papers per day
        };

        const duration = calculateDuration(startTime, endTime);

        for (const targetClass of classes) {
            const subjects = targetClass.subjects || [];
            if (subjects.length === 0) continue;

            const sessions = [];
            let currentPaperDate = new Date(startDate);

            for (const subject of subjects) {
                // Find teacher for this subject from timetable
                const timetableEntry = targetClass.timetable?.find(t => t.subject === subject);
                const teacherName = timetableEntry ? timetableEntry.teacher : null;

                let foundDate = false;
                let attemptDate = new Date(currentPaperDate);

                // Try to find a date where both class and teacher (if any) is available
                // We limit search to 30 days to avoid infinite loops
                for (let i = 0; i < 30; i++) {
                    const dateStr = attemptDate.toISOString().split('T')[0];

                    // Check if class already has a paper on this day (not possible in this simple loop, but good for robust logic)
                    const classHasPaper = sessions.some(s => new Date(s.date).toISOString().split('T')[0] === dateStr);

                    if (!classHasPaper && isTeacherAvailable(dateStr, teacherName)) {
                        // Success!
                        const dateFinal = new Date(attemptDate);
                        sessions.push({
                            subject,
                            date: dateFinal,
                            startTime,
                            endTime,
                            duration,
                            room: 'Exam Hall',
                            totalMarks: 100
                        });

                        // Record teacher usage
                        if (teacherName) {
                            teacherDailyCount[dateStr][teacherName] = (teacherDailyCount[dateStr][teacherName] || 0) + 1;
                        }

                        // Advance currentPaperDate for NEXT subject of THIS class
                        currentPaperDate = getNextDate(dateFinal);
                        foundDate = true;
                        break;
                    }

                    attemptDate = getNextDate(attemptDate);
                }

                if (!foundDate) {
                    console.error(`Could not find a valid date for ${subject} in class ${targetClass.name}`);
                }
            }

            if (sessions.length > 0) {
                const exam = await Exam.create({
                    title,
                    class: targetClass._id,
                    term,
                    sessions,
                    status: 'upcoming'
                });
                generatedExams.push(exam);
            }
        }

        res.status(201).json({
            success: true,
            message: `Successfully generated ${generatedExams.length} exam schedules.`,
            data: generatedExams
        });

    } catch (error) {
        console.error('Error in generateAutoSchedule:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
// Update exam
// @route   PUT /api/exams/:id
exports.updateExam = async (req, res) => {
    try {
        if (req.body.sessions) {
            req.body.sessions = req.body.sessions.map(s => ({
                ...s,
                duration: calculateDuration(s.startTime, s.endTime)
            }));
        }
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
        res.status(200).json({ success: true, data: exam });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
