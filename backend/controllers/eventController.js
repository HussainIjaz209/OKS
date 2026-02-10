const Event = require('../models/Event');
const fs = require('fs');
const path = require('path');

// @desc    Get all published events
// @route   GET /api/events
// @access  Public/Student
const getEvents = async (req, res) => {
    try {
        const filter = req.query.publishedOnly === 'true' ? { isPublished: true } : {};
        const events = await Event.find(filter).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
    try {
        const eventData = { ...req.body };
        if (req.files && req.files.length > 0) {
            eventData.images = req.files.map(file => `uploads/events/${file.filename}`);
        }
        const newEvent = new Event(eventData);
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
    try {
        const eventData = { ...req.body };

        // If new images are uploaded, append them to existing images
        if (req.files && req.files.length > 0) {
            const existingEvent = await Event.findById(req.params.id);
            const newImages = req.files.map(file => `uploads/events/${file.filename}`);
            eventData.images = existingEvent.images ? [...existingEvent.images, ...newImages] : newImages;
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, eventData, { new: true });
        if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
        res.json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        console.error('Error fetching event by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
    try {
        // First, find the event to get its images
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Delete all associated image files from filesystem
        if (event.images && event.images.length > 0) {
            event.images.forEach(imagePath => {
                try {
                    const fullPath = path.join(__dirname, '../', imagePath);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                        console.log(`Deleted image file: ${imagePath}`);
                    }
                } catch (fileError) {
                    console.error(`Error deleting file ${imagePath}:`, fileError);
                    // Continue with deletion even if file deletion fails
                }
            });
        }

        // Now delete the event from database
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event and associated images deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
