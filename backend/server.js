const express = require('express');
const dotenv = require('dotenv');


// Load env vars immediately
dotenv.config({ override: true });

const cors = require('cors');
const connectDB = require('./config/db');
const admissionRoutes = require('./routes/admissionRoutes');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');
const feeRoutes = require('./routes/feeRoutes');
const jobRoutes = require('./routes/jobRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { initFeeScheduler } = require('./utils/feeScheduler');

// Initialize database connection
connectDB();

const { seedClasses } = require('./controllers/classController');
seedClasses();

// Initialize fee scheduler (only for local dev, not serverless)
if (process.env.NODE_ENV !== 'production') {
    initFeeScheduler();
}

const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/admissions', admissionRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/evaluations', require('./routes/evaluationRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Only start server if running directly (not imported as module for serverless)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export app for serverless deployment
module.exports = app;
