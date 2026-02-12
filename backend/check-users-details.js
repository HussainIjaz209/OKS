const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath, override: true });

// Define minimal schemas
const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema);

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'username email role');
        console.log('--- EXISTING USERS ---');
        console.log(JSON.stringify(users, null, 2));
        console.log('----------------------');
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkUsers();
