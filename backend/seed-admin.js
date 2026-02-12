const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath, override: true });

const User = require('./models/User');

const seedAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected.');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists:');
            console.log('Username:', existingAdmin.username);
            console.log('Role:', existingAdmin.role);
        } else {
            console.log('No admin found. Creating default admin...');

            // Create admin with explicit _id (required by schema)
            const adminUser = new User({
                _id: new mongoose.Types.ObjectId(),
                username: 'admin',
                password: 'admin123',
                role: 'admin'
            });

            await adminUser.save();
            console.log('✅ Default Admin Created Successfully!');
            console.log('-----------------------------------');
            console.log('Username: admin');
            console.log('Password: admin123');
            console.log('Role: admin');
            console.log('-----------------------------------');
            console.log('You can now login with these credentials.');
        }

        await mongoose.connection.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

seedAdmin();
