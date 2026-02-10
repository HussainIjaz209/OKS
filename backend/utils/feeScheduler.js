const cron = require('node-cron');
const Student = require('../models/Student');
const FeeStructure = require('../models/FeeStructure');
const Concession = require('../models/Concession');
const FeeInvoice = require('../models/FeeInvoice');

const normalizeClass = (className) => {
    if (!className) return '';
    return className
        .replace(/-/g, ' ')
        .replace(/1/g, 'I')
        .replace(/2/g, 'II')
        .replace(/3/g, 'III')
        .replace(/4/g, 'IV')
        .replace(/5/g, 'V')
        .replace(/6/g, 'VI')
        .replace(/7/g, 'VII')
        .replace(/8/g, 'VIII')
        .replace(/9/g, 'IX')
        .replace(/10/g, 'X')
        .replace(/Grade /i, '') // Also remove 'Grade ' if present to match simpler labels if needed, or keep it consistent
        .trim();
};

const generateMonthlyInvoices = async (targetMonth, overwrite = false) => {
    try {
        const month = targetMonth || new Date().toISOString().slice(0, 7); // YYYY-MM
        console.log(`Starting invoice generation for ${month}...`);

        // 1. Get all students that should be invoiced
        // Include 'approved' status OR legacy records with no status field
        const students = await Student.find({
            $or: [
                { status: 'approved' },
                { status: { $exists: false } },
                { status: null }
            ]
        });

        // 2. Get all fee structures
        const structures = await FeeStructure.find();
        const structureMap = structures.reduce((acc, s) => {
            acc[normalizeClass(s.class)] = s.monthlyFee;
            return acc;
        }, {});

        let generatedCount = 0;
        let skippedCount = 0;
        let updatedCount = 0;

        for (const student of students) {
            const studentClass = normalizeClass(student.CurrentClass || student.AdmissionClass);
            const baseFee = structureMap[studentClass] || 0;

            // 3. Check if invoice already exists
            const existingInvoice = await FeeInvoice.findOne({
                studentId: student._id,
                month: month
            });

            if (existingInvoice && !overwrite) {
                skippedCount++;
                continue;
            }

            // 4. Calculate concession
            const concession = await Concession.findOne({
                studentId: student._id,
                startMonth: { $lte: month }
            }).sort({ startMonth: -1 });

            let finalAmount = baseFee;
            if (concession) {
                if (concession.mode === 'fixed') {
                    finalAmount = Math.max(0, baseFee - concession.amount);
                } else if (concession.mode === 'percentage') {
                    finalAmount = Math.max(0, baseFee * (1 - concession.amount / 100));
                }
            }

            if (existingInvoice && overwrite) {
                existingInvoice.amount = finalAmount;
                existingInvoice.studentName = `${student.FirstName} ${student.LastName}`;
                existingInvoice.class = studentClass;
                await existingInvoice.save();
                updatedCount++;
                continue;
            }

            // 5. Create invoice
            const invoiceNumber = `INV-${month.replace('-', '')}-${student._id}-${Math.floor(1000 + Math.random() * 9000)}`;
            const dueDate = new Date();
            dueDate.setDate(10); // Default due date 10th of the month
            if (dueDate < new Date()) {
                dueDate.setMonth(dueDate.getMonth() + 1);
            }

            const newInvoice = new FeeInvoice({
                invoiceNumber,
                studentId: student._id,
                studentName: `${student.FirstName} ${student.LastName}`,
                class: studentClass,
                month: month,
                amount: finalAmount,
                dueDate: dueDate,
                status: 'pending',
                type: 'Tuition Fee',
                description: `Automatically generated tuition fee for ${month}`
            });

            await newInvoice.save();
            generatedCount++;
        }

        console.log(`Invoice generation complete. Generated: ${generatedCount}, Updated: ${updatedCount}, Skipped: ${skippedCount}`);
        return { success: true, generatedCount, updatedCount, skippedCount };
    } catch (error) {
        console.error('Error in generateMonthlyInvoices:', error);
        return { success: false, error: error.message };
    }
};

const initFeeScheduler = () => {
    // Schedule for 00:00 on the 1st day of every month
    cron.schedule('0 0 1 * *', () => {
        console.log('Running scheduled monthly invoice generation...');
        generateMonthlyInvoices();
    });
    console.log('Fee scheduler initialized.');
};

module.exports = { initFeeScheduler, generateMonthlyInvoices };
