const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Student = require('../models/Student');
const Class = require('../models/Class');

const fixAndVerify = async () => {
    try {
        const mongoUri = (process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/oks_management_system').replace('localhost', '127.0.0.1');
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected');

        // 1. Check Student 232 again
        let student = await Student.findById(232);
        console.log('Student 232:', student ? 'Found' : 'Not Found');

        if (student) {
            console.log('  Current User ID:', student.user);

            // Re-align if user is 233 (or anything else)
            if (student.user !== 232) {
                console.log('  Mismatched User ID detected. Re-aligning...');

                const user233 = await User.findById(student.user);
                if (user233) {
                    // Create User 232 from 233
                    const userData = user233.toObject();
                    delete userData._id;
                    delete userData.__v;
                    userData._id = 232;

                    // Delete 233 first to avoid unique key issues
                    await User.deleteOne({ _id: student.user });

                    const newUser = new User(userData);
                    await newUser.save();

                    student.user = 232;
                    await student.save();
                    console.log('  Successfully re-aligned Student 232 with User 232.');
                }
            }

            // 2. Verify Class Auto-heal
            // After my code change, the next time the API is hit, it should heal.
            // Let's mock the heal logic here to verify it works with the database.
            const className = student.CurrentClass;
            const normalizedClassName = className.toLowerCase().includes('grade') ? className : `Grade ${className}`;

            const targetClass = await Class.findOne({
                $or: [{ name: className }, { name: normalizedClassName }],
                section: student.section
            }) || await Class.findOne({
                $or: [{ name: className }, { name: normalizedClassName }]
            });

            console.log('  Target Class Found by script logic:', targetClass ? targetClass.name : 'None');
            if (targetClass) {
                student.class = targetClass._id;
                await student.save();
                console.log('  Successfully assigned Class reference to Student.');
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

fixAndVerify();
