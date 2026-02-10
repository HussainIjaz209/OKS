const mongoose = require('mongoose');
const Event = require('./models/Event');
const dotenv = require('dotenv');

dotenv.config();

const events = [
    {
        title: 'Annual Science Fair 2024',
        description: 'Showcase your innovative projects and compete for the grand prize! Join us for a day of discovery and learning.',
        date: new Date('2024-12-15T09:00:00'),
        location: 'Main Auditorium',
        category: 'Academic',
        images: ['https://example.com/science.jpg'],
        isPublished: true
    },
    {
        title: 'Inter-School Football Tournament',
        description: 'Cheer for your team as they battle it out for the championship trophy.',
        date: new Date('2024-12-20T10:00:00'),
        location: 'School Ground',
        category: 'Sports',
        isPublished: true
    },
    {
        title: 'Christmas Carol Concert',
        description: 'An evening of festive music and performances by the school choir.',
        date: new Date('2024-12-22T18:00:00'),
        location: 'School Hall',
        category: 'Cultural',
        isPublished: true
    },
    {
        title: 'Art Exhibition',
        description: 'Explore the creative works of our talented student artists.',
        date: new Date('2025-01-05T11:00:00'),
        location: 'Art Gallery',
        category: 'Arts',
        isPublished: true
    },
    {
        title: 'Math Olympiad',
        description: 'Test your problem-solving skills in this challenging competition.',
        date: new Date('2025-01-10T09:00:00'),
        location: 'Exam Hall',
        category: 'Academic',
        isPublished: true
    }
];

const seedEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/OKS');
        await Event.deleteMany({});
        await Event.insertMany(events);
        console.log('Events seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding events:', error);
        process.exit(1);
    }
};

seedEvents();
