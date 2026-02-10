const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Class = require('./models/Class');
const Exam = require('./models/Exam');
const Result = require('./models/Result');
const Student = require('./models/Student');

dotenv.config();

async function seedTestData() {
    try {
        await connectDB();
        console.log('Connected to DB');

        // 1. Update Timetable for "Grade 4" (or find first available class)
        const targetClass = await Class.findOne({ name: /Grade 4/i }) || await Class.findOne({});
        if (targetClass) {
            console.log(`Updating timetable for class: ${targetClass.name}`);
            targetClass.timetable = [
                { day: 'Monday', startTime: '08:00', endTime: '09:00', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'Room 401' },
                { day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'Science', teacher: 'Ms. Johnson', room: 'Lab 1' },
                { day: 'Monday', startTime: '10:00', endTime: '10:30', subject: 'Break' },
                { day: 'Tuesday', startTime: '08:00', endTime: '09:00', subject: 'English', teacher: 'Mr. Davis', room: 'Room 402' },
                { day: 'Wednesday', startTime: '11:00', endTime: '12:00', subject: 'History', teacher: 'Ms. Wilson', room: 'Room 403' }
            ];
            await targetClass.save();
        }

        // 2. Create Sample Exam
        if (targetClass) {
            console.log(`Creating sample exam for class: ${targetClass.name}`);
            await Exam.deleteMany({ class: targetClass._id });
            const exam = await Exam.create({
                title: 'Mid Term Examination 2024',
                class: targetClass._id,
                term: 'First Term',
                status: 'upcoming',
                sessions: [
                    { subject: 'Mathematics', date: new Date('2024-12-20'), startTime: '09:00 AM', duration: '2 Hours', room: 'Hall A' },
                    { subject: 'Science', date: new Date('2024-12-22'), startTime: '09:00 AM', duration: '2 Hours', room: 'Lab 2' }
                ]
            });

            // 3. Create Sample Result for first student in that class
            const student = await Student.findOne({ class: targetClass._id }) || await Student.findOne({});
            if (student) {
                console.log(`Creating sample result for student: ${student.FirstName} ${student.LastName}`);
                await Result.deleteMany({ student: student._id });
                await Result.create({
                    exam: exam._id,
                    student: student._id,
                    percentage: 85,
                    overallGrade: 'A',
                    resultStatus: 'Pass',
                    marks: [
                        { subject: 'Mathematics', obtainedMarks: 88, totalMarks: 100, grade: 'A', remarks: 'Excellent' },
                        { subject: 'Science', obtainedMarks: 82, totalMarks: 100, grade: 'B+', remarks: 'Good' }
                    ]
                });
            }
        }

        console.log('Seed data created successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
}

seedTestData();
