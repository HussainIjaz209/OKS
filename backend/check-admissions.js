const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath, override: true });

// Define minimal schema to avoid dependency issues
const admissionSchema = new mongoose.Schema({}, { strict: false });
const Admission = mongoose.model('Admission', admissionSchema);

const checkAdmissions = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const count = await Admission.countDocuments();
        console.log(`Total Admissions in DB: ${count}`);

        if (count > 0) {
            const sample = await Admission.findOne();
            console.log('Sample Admission:', JSON.stringify(sample, null, 2));
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};


checkAdmissions();
