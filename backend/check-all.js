const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath, override: true });

// Define minimal schemas
const admissionSchema = new mongoose.Schema({}, { strict: false });
const Admission = mongoose.model('Admission', admissionSchema);

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema);

const studentSchema = new mongoose.Schema({}, { strict: false });
const Student = mongoose.model('Student', studentSchema);

const checkAll = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const admissionCount = await Admission.countDocuments();
        const userCount = await User.countDocuments();
        const studentCount = await Student.countDocuments();

        console.log('--- DATABASE COUNTS ---');
        console.log(`Admissions: ${admissionCount}`);
        console.log(`Users:      ${userCount}`);
        console.log(`Students:   ${studentCount}`);
        console.log('-----------------------');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkAll();
