const Material = require('../models/Material');

const uploadMaterial = async (req, res) => {
    try {
        const { title, description, className, section, subject, teacher } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `/uploads/materials/${req.file.filename}`;
        const fileSize = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
        const fileType = req.file.originalname.split('.').pop().toLowerCase();

        const material = new Material({
            title,
            description,
            className,
            section,
            subject,
            uploadedBy: teacher,
            fileUrl,
            fileSize,
            fileType
        });

        const savedMaterial = await material.save();
        res.status(201).json(savedMaterial);
    } catch (error) {
        console.error('Error uploading material:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const getTeacherMaterials = async (req, res) => {
    try {
        const materials = await Material.find({ uploadedBy: req.params.teacherId }).sort({ createdAt: -1 });
        res.json(materials);
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        // Optionally delete the physical file here
        // const fs = require('fs');
        // const path = require('path');
        // const filePath = path.join(__dirname, '..', material.fileUrl);
        // if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await Material.findByIdAndDelete(req.params.id);
        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        console.error('Error deleting material:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getStudentMaterials = async (req, res) => {
    try {
        const { className, section, subject } = req.query;

        // Normalization: Handle "Grade X" vs "X" variations
        let normalizedClass = className.replace(/^Grade\s+/i, '');
        let classPattern = `^(Grade\\s+)?${normalizedClass}$`;

        const query = {
            className: { $regex: new RegExp(classPattern, 'i') }
        };

        // If student has a section, match that specific section OR grade-wide (empty/Not Assigned)
        // If student has NO section, don't filter by section (allow viewing all in that grade)
        if (section && section !== 'Not Assigned') {
            query.section = { $regex: new RegExp(`^${section}$|^$|^Not Assigned$`, 'i') };
        }

        if (subject) query.subject = subject;

        const materials = await Material.find(query).sort({ createdAt: -1 });
        res.json(materials);
    } catch (error) {
        console.error('Error fetching student materials:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    uploadMaterial,
    getTeacherMaterials,
    deleteMaterial,
    getStudentMaterials
};
