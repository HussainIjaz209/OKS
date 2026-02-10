const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');

const connectDB = async () => {
    try {
        const mongoUri = (process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/oks_management_system').replace('localhost', '127.0.0.1');
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Connection Error:', error);
        process.exit(1);
    }
};

const migrateIds = async () => {
    try {
        await connectDB();

        console.log('Starting migration...');

        // 1. Find all Users with role 'teacher' or 'admin' and numeric _id
        const usersToMigrate = await User.find({
            role: { $in: ['teacher', 'admin'] },
            _id: { $type: 'number' }
        });

        console.log(`Found ${usersToMigrate.length} users to migrate.`);

        for (const user of usersToMigrate) {
            console.log(`Migrating user: ${user.username} (${user.role}) - ID: ${user._id}`);

            // Rename old user to avoid unique key collision during duplication
            const originalUsername = user.username;
            const originalEmail = user.email;

            user.username = `${user.username}_old_${user._id}`;
            // user.email = `old_${user.email}`; // Email usually unique too
            // Note: email might be null for some users or not unique if validation lax, but let's be safe
            if (user.email) {
                user.email = `old_${user._id}_${user.email}`;
            }

            await user.save();
            console.log(`  -> Renamed old user to ${user.username}`);

            // Clone data
            const userData = user.toObject();
            delete userData._id; // Remove old ID
            delete userData.__v;

            // Restore original unique fields for the new user
            userData.username = originalUsername;
            userData.email = originalEmail;

            // Create new User with ObjectId (auto-generated manually)
            const newUser = new User(userData);
            newUser._id = new mongoose.Types.ObjectId();

            await newUser.save();
            console.log(`  -> Created new User with ObjectId: ${newUser._id}`);

            // Update linked profile
            if (user.role === 'teacher' && user.teacherId) {
                const teacher = await Teacher.findById(user.teacherId);
                if (teacher) {
                    teacher.user = newUser._id;
                    await teacher.save();
                    console.log(`  -> Updated Teacher profile ${teacher._id} with new User ID.`);
                } else {
                    console.warn(`  -> WARNING: Linked Teacher profile ${user.teacherId} not found.`);
                }
            } else if (user.role === 'admin') {
                // Admin might be linked differently. 
                // Admin model has `user` field.
                // We need to find the Admin document that points to the OLD user ID (numeric).
                // But wait, we renamed the user, so the linking ID in Admin (user: 232) is still valid for finding the Admin.
                // Admin.user is just a reference.

                // We search for Admin where user == user._id (which is 232)
                const admin = await Admin.findOne({ user: user._id });
                if (admin) {
                    admin.user = newUser._id;
                    await admin.save();
                    console.log(`  -> Updated Admin profile ${admin._id} with new User ID.`);
                } else {
                    console.warn(`  -> WARNING: Linked Admin profile not found for user ${user._id}.`);
                }
            }

            // Delete old user
            await User.deleteOne({ _id: user._id });
            console.log(`  -> Deleted old User record.`);
        }

        console.log('Migration completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateIds();
