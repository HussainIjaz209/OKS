const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.resolve(__dirname, '.env');
console.log(`Loading .env from: ${envPath}`);
const result = dotenv.config({ path: envPath, override: true });

if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('.env file loaded successfully');
}

const uri = process.env.MONGO_URI;

console.log('--- MongoDB Connection Test ---');
console.log(`MONGO_URI from env: ${uri ? (uri.substring(0, 20) + '...') : 'undefined'}`);

if (!uri) {
    console.error('ERROR: MONGO_URI is not defined in .env');
    process.exit(1);
}

const connect = async () => {
    try {
        console.log('Attempting to connect...');
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
        console.log(`Host: ${mongoose.connection.host}`);
        console.log(`Database: ${mongoose.connection.name}`);
        await mongoose.connection.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('❌ CONNECTION FAILED');
        console.error(`Error Name: ${error.name}`);
        console.error(`Error Message: ${error.message}`);
        console.error(`Error Code: ${error.code}`);
        console.error(`Error CodeName: ${error.codeName}`);

        if (error.message.includes('bad auth')) {
            console.log('\n💡 DIAGNOSIS: Authentication Failed');
            console.log('1. Check if the username "hijaz4981" is correct.');
            console.log('2. Check if the password "Hussainijaz123" is correct (no extra spaces?).');
            console.log('3. Did you update the user password in MongoDB Atlas > Database Access?');
        } else if (error.message.includes('querySrv ENOTFOUND')) {
            console.log('\n💡 DIAGNOSIS: DNS/Network Issue');
            console.log('1. Check your internet connection.');
            console.log('2. Verify the hostname "cluster0.w0431jt.mongodb.net" is correct.');
        } else {
            console.log('\n💡 DIAGNOSIS: Network or Whitelist Issue');
            console.log('1. Go to MongoDB Atlas > Network Access.');
            console.log('2. Ensure IP "0.0.0.0/0" is added to the whitelist.');
        }
    }
};

connect();
