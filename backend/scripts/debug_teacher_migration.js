const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Teacher = require('../models/Teacher');

const check = async () => {
    try {
        const mongoUri = (process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/oks_management_system').replace('localhost', '127.0.0.1');
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected');

        // Check a relocated teacher
        const user = await User.findOne({ role: 'teacher' }).lean();
        console.log('Sample Teacher User:', JSON.stringify(user, null, 2));

        if (user && user.teacherId) {
            const teacher = await Teacher.findById(user.teacherId).lean();
            console.log('Linked Teacher Profile:', teacher ? 'Found' : 'Not Found');
            if (teacher) {
                console.log('Teacher Profile details:', { _id: teacher._id, user: teacher.user });
                console.log('Link matches User _id?', String(teacher.user) === String(user._id));
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

check();
