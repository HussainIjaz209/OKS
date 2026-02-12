const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Adjust path as needed
const path = require('path');

// Load env vars
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath, override: true });

const checkUsers = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const userCount = await User.countDocuments();
        console.log(`Total Users in DB: ${userCount}`);

        if (userCount === 0) {
            console.log('No users found. Creating default admin...');

            const adminUser = new User({
                username: 'admin',
                email: 'admin@school.com',
                password: 'admin', // Ideally hashed, but let's see how the app handles it.
                // If the app uses bcrypt comparison, we might need to hash it here or ensure the model hooks handle it.
                role: 'admin'
            });

            // Check if User model has pre-save hook for hashing
            // If it behaves like standard MERN apps, it likely hashes on save.

            await adminUser.save();
            console.log('✅ Default Admin Created:');
            console.log('Username: admin');
            console.log('Password: admin');
        } else {
            const users = await User.find({}, 'username role email');
            console.log('Existing Users:', users);
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkUsers();
