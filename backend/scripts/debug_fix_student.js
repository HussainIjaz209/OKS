const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Student = require('../models/Student');

const check = async () => {
    try {
        const mongoUri = (process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/oks_management_system').replace('localhost', '127.0.0.1');
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected');

        const student = await Student.findById(232).lean();
        console.log('Student 232:', student ? 'Found' : 'Not Found');
        if (student) {
            console.log('Linked User ID:', student.user);
        }

        const user233 = await User.findById(233).lean();
        console.log('User 233:', user233 ? 'Found' : 'Not Found');
        if (user233) {
            console.log('User 233 Username:', user233.username);
        }

        const user232 = await User.findById(232).lean();
        console.log('User 232:', user232 ? 'Found' : 'Not Found');

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

check();
