const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

// Load env vars
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath, override: true });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('User "admin" already exists.');
            // Ensure it has admin role
            if (existingAdmin.role !== 'admin') {
                console.log('Updating role to admin...');
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('Role updated.');
            }
        } else {
            console.log('Creating user "admin"...');
            const newAdmin = new User({
                _id: new mongoose.Types.ObjectId(),
                username: 'admin',
                password: 'admin',
                role: 'admin',
                email: 'admin@school.com'
            });
            await newAdmin.save();
            console.log('✅ User "admin" created with password "admin".');
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

createAdmin();
