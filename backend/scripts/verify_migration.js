const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');

const verify = async () => {
    try {
        const mongoUri = (process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/oks_management_system').replace('localhost', '127.0.0.1');
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected');

        // Check Admin 'Salmanijaz'
        const adminUser = await User.findOne({ username: 'Salmanijaz' });
        console.log('Admin User found:', adminUser ? 'Yes' : 'No');
        if (adminUser) {
            console.log('Admin User ID Type:', typeof adminUser._id);
            console.log('Admin User ID:', adminUser._id);
            const adminProfile = await Admin.findOne({ user: adminUser._id });
            console.log('Admin Profile Linked:', adminProfile ? 'Yes' : 'No');
        }

        // Check Student 232
        const student = await Student.findById(232);
        console.log('Student 232 found:', student ? 'Yes' : 'No');
        if (student) {
            console.log('Student ID Type:', typeof student._id);
        }

        // Check a Teacher 'Muhammad_Noman' (migrated)
        const teacherUser = await User.findOne({ username: 'Muhammad_Noman' });
        console.log('Teacher User found:', teacherUser ? 'Yes' : 'No');
        if (teacherUser) {
            console.log('Teacher User ID Type:', typeof teacherUser._id);
            const teacherProfile = await Teacher.findOne({ user: teacherUser._id });
            console.log('Teacher Profile Linked:', teacherProfile ? 'Yes' : 'No');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

verify();
