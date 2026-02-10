const Student = require('../models/Student');

// @desc    Submit a new admission application
// @route   POST /api/admissions
// @access  Public
const createAdmission = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            studentName, // keeping just in case
            fatherName,
            admissionClass,
            admissionDate,
            dateOfBirth,
            religion,
            bloodGroup,
            gender,
            fatherOccupation,
            fatherAddress,
            fatherCNIC,
            guardianName,
            guardianContact,
            guardianEmail,
            guardianRelation,
            guardianCNIC,
            guardianEducation,
            guardianOccupation,
            guardianAddress,
            declarationAccepted
        } = req.body;

        // Fetch the last student to determine new ID
        // Use centralized ID generator to avoid collisions with Users/Teachers
        const { getNextId } = require('../utils/idGenerator');
        const newId = await getNextId();

        // Determine RollNo (still scoped to Student collection for now, OR keep as is)
        // Ideally RollNo should be independent, but let's keep the logic relative to last student
        const lastStudent = await Student.findOne({}, { RollNo: 1 }).sort({ RollNo: -1 }).limit(1).lean();
        let newRollNo = 1;

        if (lastStudent && lastStudent.RollNo) {
            newRollNo = lastStudent.RollNo + 1;
        } else {
            newRollNo = newId; // Fallback
        }

        // Map Admission Form fields to Student Schema
        const studentData = {
            _id: newId, // Explicitly set numeric ID
            RollNo: newRollNo, // Required by DB schema
            FirstName: firstName,
            LastName: lastName,
            fatherName: fatherName,
            AdmissionClass: admissionClass, // Targeted class
            AdmissionDate: admissionDate || new Date(),
            DateOfBirth: dateOfBirth,
            Religion: religion,
            bloodGroup: bloodGroup,
            Gender: gender, // 'Male', 'Female', 'Other'
            FatherOccupation: fatherOccupation,
            PresentAddress: fatherAddress, // fatherAddress -> PresentAddress
            CNIC: fatherCNIC,
            GuardianName: guardianName,
            GuardianContactNo: guardianContact,
            Relation: guardianRelation,
            GuardianPresentAddress: guardianAddress,
            declarationAccepted: declarationAccepted,
            status: 'pending', // Default status
            CurrentClass: admissionClass, // Required by DB schema, using admissionClass as initial value

            // Extra mapping for consistency if needed in future
            guardianEmail: guardianEmail,
        };

        const student = new Student(studentData);
        const savedStudent = await student.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        console.error('Admission submission error:', error);
        res.status(400).json({
            message: error.message,
            errors: error.errors
        });
    }
};

// @desc    Get all admission applications (pending status)
// @route   GET /api/admissions
// @access  Private/Admin
const getAdmissions = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        if (status === 'approved') {
            query = {
                $or: [
                    { status: 'approved' },
                    { status: { $exists: false } },
                    { status: null }
                ]
            };
        } else if (status) {
            query.status = status;
        } else {
            query = {}; // Fetch all students if no status specified
        }

        const admissions = await Student.find(query).sort({ createdAt: -1 });
        res.json(admissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update admission status
// @route   PUT /api/admissions/:id
// @access  Private/Admin
const updateAdmissionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const student = await Student.findById(req.params.id);

        if (student) {
            student.status = status;
            // If approved, we might want to generate a RollNo or assign a Class ID eventually
            const updatedStudent = await student.save();
            res.json(updatedStudent);
        } else {
            res.status(404).json({ message: 'Admission application not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete admission application
// @route   DELETE /api/admissions/:id
// @access  Private/Admin
const deleteAdmission = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (student) {
            await student.deleteOne();
            res.json({ message: 'Admission application removed' });
        } else {
            res.status(404).json({ message: 'Admission application not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAdmission,
    getAdmissions,
    updateAdmissionStatus,
    deleteAdmission,
};
