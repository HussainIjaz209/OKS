const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const FeeInvoice = require('../models/FeeInvoice');
const Result = require('../models/Result');
const Class = require('../models/Class');
const { hashSHA256 } = require('../utils/hashUtils');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().lean();

        // Enrich user data
        const enrichedUsers = await Promise.all(users.map(async (user) => {
            let details = {};
            let status = 'active';
            let joinDate = null;
            let subInfo = 'N/A';

            if (user.role === 'teacher' && user.teacherId) {
                const teacher = await Teacher.findById(user.teacherId).lean();
                if (teacher) {
                    details = { ...teacher };
                    status = teacher.status || 'pending';
                    joinDate = teacher.createdAt;
                    subInfo = teacher.email || 'N/A';
                }
            } else if (user.role === 'student' && user.studentId) {
                const student = await Student.findById(user.studentId).lean();
                if (student) {
                    details = { ...student };
                    status = student.status || 'active';
                    joinDate = student.createdAt;
                    subInfo = student.RollNo ? `Roll No: ${student.RollNo}` : (student.CurrentClass ? `Class: ${student.CurrentClass}` : 'N/A');
                }
            }

            return {
                id: user._id,
                _id: user._id,
                name: details.firstName && details.lastName ? `${details.firstName} ${details.lastName}` : (details.FirstName && details.LastName ? `${details.FirstName} ${details.LastName}` : (details.fullName || user.username)),
                username: user.username,
                email: subInfo,
                role: user.role,
                status: status,
                joinDate: joinDate && !isNaN(new Date(joinDate).getTime()) ? new Date(joinDate).toISOString().split('T')[0] : 'N/A',
                details: details
            };
        }));

        res.json(enrichedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, role } = req.body;

        if (role === 'teacher') {
            let user = await User.findOne({
                $or: [
                    { _id: id },
                    { _id: !isNaN(id) ? parseInt(id) : null }
                ]
            });
            if (!user || !user.teacherId) {
                return res.status(404).json({ message: 'Teacher not found' });
            }

            await Teacher.findByIdAndUpdate(user.teacherId, { status });
            return res.json({ message: `Teacher status updated to ${status}` });
        } else if (role === 'student') {
            let user = await User.findOne({
                $or: [
                    { _id: id },
                    { _id: !isNaN(id) ? parseInt(id) : null }
                ]
            });
            if (!user || !user.studentId) {
                return res.status(404).json({ message: 'Student not found' });
            }

            const updateData = { status };
            if (status === 'withdrawn') {
                updateData.withdrawnDate = new Date();
            }

            await Student.findByIdAndUpdate(user.studentId, updateData);
            return res.json({ message: `Student status updated to ${status}` });
        }

        // Add logical for other roles if needed

        res.json({ message: 'Status updated' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        if (req.file) {
            updates.profilePicture = req.file.filename;
        }

        let user = await User.findOne({
            $or: [
                { _id: id },
                { _id: !isNaN(id) ? parseInt(id) : null }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'teacher' && user.teacherId) {
            await Teacher.findByIdAndUpdate(user.teacherId, updates);
            // Also update main User email if changed
            if (updates.email) {
                user.email = updates.email;
                await user.save();
            }
        } else if (user.role === 'student' && user.studentId) {
            await Student.findByIdAndUpdate(user.studentId, updates);
            // Also update main User email if changed
            if (updates.email) {
                user.email = updates.email;
                await user.save();
            }
        }

        res.json({ message: 'User details updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const mongoose = require('mongoose');

        // Robust match for User (_id is Mixed)
        const userMatch = [{ _id: id }];
        if (!isNaN(id)) userMatch.push({ _id: parseInt(id) });
        if (mongoose.Types.ObjectId.isValid(id)) userMatch.push({ _id: new mongoose.Types.ObjectId(id) });

        let user = await User.findOne({ $or: userMatch });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const role = user.role;
        const lookupId = user._id; // Use the actual DB ID for subsequent searches
        const studentId = user.studentId;
        const teacherId = user.teacherId;
        const adminId = user.adminId;

        // 1. Delete associated profile and related records
        if (role === 'teacher' && teacherId) {
            // Remove from Teacher collection
            await Teacher.findByIdAndDelete(teacherId);
            // Reset Class Teacher reference
            await Class.updateMany({ classTeacher: teacherId }, { $set: { classTeacher: null } });
        } else if (role === 'student' && studentId) {
            // Remove from Student collection
            await Student.findByIdAndDelete(studentId);
            // Delete Fee Invoices
            await FeeInvoice.deleteMany({ studentId: studentId });
            // Delete Exam Results
            await Result.deleteMany({ student: studentId });
            // Remove from Class student list
            await Class.updateMany({ students: studentId }, { $pull: { students: studentId } });
        } else if (role === 'admin') {
            // Delete from Admin collection
            if (adminId) {
                await Admin.findByIdAndDelete(adminId);
            } else {
                // Fallback: search by user reference or email
                await Admin.deleteOne({ $or: [{ user: lookupId }, { email: user.email }] });
            }
        }

        // 2. Delete the main User record
        await User.deleteOne({ _id: lookupId });

        res.json({ message: `User (${role}) and all associated data deleted successfully` });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



const createAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, username, password } = req.body;

        // Validations
        if (!firstName || !lastName || !email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Email already exists in Admin records' });
        }

        // Create User
        // _id will be auto-generated ObjectId
        const newUser = new User({
            username,
            email,
            password: hashSHA256(password), // Hashed!
            role: 'admin',
        });

        const newAdmin = new Admin({
            user: newUser._id,
            firstName,
            lastName,
            email
        });

        // Add adminId to user if we want to follow the pattern
        newUser.adminId = newAdmin._id;

        await newUser.save();
        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully', user: newUser });

    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateCredentials = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, currentPassword, newPassword } = req.body;

        let user = await User.findOne({
            $or: [
                { _id: id },
                { _id: !isNaN(id) ? parseInt(id) : null }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password (using standard comparison for plaintext)
        const isPasswordCorrect = await user.matchPassword(currentPassword);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        if (username && username !== user.username) {
            // Check if username already exists for another user
            const existingUser = await User.findOne({ username, _id: { $ne: id } });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            user.username = username;
        }

        if (newPassword) {
            user.password = hashSHA256(newPassword);
        }

        await user.save();

        res.json({ message: 'Credentials updated successfully' });
    } catch (error) {
        console.error('Error updating credentials:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getAllUsers, updateUserStatus, updateUserDetails, deleteUser, createAdmin, updateCredentials };
