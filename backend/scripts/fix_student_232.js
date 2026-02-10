const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Student = require('../models/Student');

const fix = async () => {
    try {
        const mongoUri = (process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/oks_management_system').replace('localhost', '127.0.0.1');
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected');

        // 1. Get User 233
        const user233 = await User.findById(233).lean();
        if (!user233) {
            console.log('User 233 not found. Already fixed?');
            return;
        }

        console.log('Found User 233:', user233.username);

        // 2. Delete User 233 to free up studentId (and username if unique)
        await User.deleteOne({ _id: 233 });
        console.log('Deleted User 233');

        // 3. Create User 232
        const userData = { ...user233 };
        delete userData._id;
        delete userData.__v;
        userData._id = 232; // Explicitly set to 232 to match Student

        const newUser = new User(userData);
        await newUser.save();
        console.log('Created User 232');

        // 4. Update Student 232 to link to User 232
        await Student.updateOne({ _id: 232 }, { user: 232 });
        console.log('Updated Student 232 to point to User 232');

        console.log('Fix completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Fix failed:', error);
        process.exit(1);
    }
};

fix();
