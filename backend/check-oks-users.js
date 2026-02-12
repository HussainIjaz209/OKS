const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath, override: true });

// Define minimal schemas
const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema);

const checkUsersOKS = async () => {
    try {
        console.log('Connecting to OKS DB...');
        await mongoose.connect(process.env.MONGO_URI);

        const count = await User.countDocuments();
        console.log(`Total Users in OKS: ${count}`);

        // Find admin users
        const admins = await User.find({ role: 'admin' }).limit(5);
        if (admins.length > 0) {
            console.log('--- ADMIN USERS ---');
            console.log(JSON.stringify(admins, null, 2));
        } else {
            console.log('❌ No users with role "admin" found.');
        }

        // Find any users to see structure
        const sampleUsers = await User.find().limit(3);
        console.log('--- SAMPLE USERS ---');
        console.log(JSON.stringify(sampleUsers, null, 2));

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkUsersOKS();
