const mongoose = require('mongoose');
const Material = require('./models/Material');

async function seedMaterials() {
    try {
        await mongoose.connect('mongodb://localhost:27017/OKS');
        console.log('Connected to OKS DB');

        const sampleMaterials = [
            {
                title: 'English Foundations Chapter 1',
                description: 'Basic introduction to English grammar.',
                subject: 'English',
                className: 'Foundation 1',
                section: 'Rose',
                fileUrl: '/uploads/materials/sample_english.pdf',
                fileSize: '1.5 MB',
                fileType: 'pdf',
                uploadedBy: 1
            },
            {
                title: 'Math - Number Systems',
                description: 'Understanding integers and real numbers.',
                subject: 'Math',
                className: 'Foundation 1',
                section: 'Rose',
                fileUrl: '/uploads/materials/sample_math.pdf',
                fileSize: '2.1 MB',
                fileType: 'pdf',
                uploadedBy: 1
            }
        ];

        await Material.deleteMany({ className: 'Foundation 1', section: 'Rose' });
        await Material.insertMany(sampleMaterials);
        console.log('Sample materials seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedMaterials();
