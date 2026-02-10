const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Student = require('../models/Student');
const Class = require('../models/Class');

const check = async () => {
    try {
        const mongoUri = (process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/oks_management_system').replace('localhost', '127.0.0.1');
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected');

        const student = await Student.findById(232).lean();
        console.log('Student 232:', JSON.stringify(student, null, 2));

        const classes = await Class.find().lean();
        console.log('Available Classes:', classes.map(c => ({ _id: c._id, name: c.name, section: c.section })));

        if (student && student.CurrentClass) {
            const targetClass = await Class.findOne({
                name: student.CurrentClass,
                section: student.section
            }) || await Class.findOne({
                name: student.CurrentClass
            });
            console.log('Matching Class Found for student.CurrentClass ("' + student.CurrentClass + '"):', targetClass ? targetClass.name : 'None');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

check();
