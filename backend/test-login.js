const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

// Load env vars
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath, override: true });

const testLogin = async (username, password, role) => {
    try {
        console.log(`Testing login for: ${username} (Role: ${role})`);
        await mongoose.connect(process.env.MONGO_URI);

        // Emulate the logic in authRoutes.js
        const user = await User.findOne({
            $or: [{ username }, { email: username }],
            role
        });

        if (!user) {
            console.log('❌ User not found with these credentials and role.');
            // Check if user exists with DIFFERENT role
            const anyUser = await User.findOne({ $or: [{ username }, { email: username }] });
            if (anyUser) {
                console.log(`   💡 User exists but has role: '${anyUser.role}'`);
            }
        } else {
            console.log('✅ User found.');
            const isMatch = await user.matchPassword(password);
            if (isMatch) {
                console.log('✅ Password match! Login should succeed.');
            } else {
                console.log(`❌ Password mismatch. DB has: '${user.password}', Provided: '${password}'`);
            }
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

// Test the default admin with hash check
const debugUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ username: 'admin' });
        console.log('Raw User Document:', user);
        if (user) {
            console.log(`Username: '${user.username}'`);
            console.log(`Role: '${user.role}'`);
            console.log(`Stored Password: '${user.password}'`);

            // Check plain match
            const isPlainMatch = await user.matchPassword('admin');
            console.log(`Password Match ('admin'): ${isPlainMatch}`);

            // Simulate what happens if we manually hashed it in DB
            // (Use this to verify if the method works for both)
            const { hashSHA256 } = require('./utils/hashUtils');
            const hashed = hashSHA256('admin');
            console.log(`Hash of 'admin': ${hashed}`);
        }
        await mongoose.connection.close();
    } catch (error) {
        console.error(error);
    }
}
debugUser();
