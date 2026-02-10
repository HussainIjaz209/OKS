const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const FeeInvoice = require('../models/FeeInvoice');
const Expense = require('../models/Expense');

// @desc    Get all dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        // 1. Basic Counts
        const totalStudents = await Student.countDocuments({ status: { $in: ['approved', 'active'] } });
        const totalTeachers = await Teacher.countDocuments();
        const totalClasses = await Class.countDocuments();
        const newApplications = await Student.countDocuments({ status: 'pending' });

        // 2. Fee Stats
        // 2. Fee Stats & Financials
        const invoices = await FeeInvoice.find({});
        // totalReceivable is what was previously called totalRevenue (sum of all invoices)
        const totalReceivable = invoices.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        // feeCollection is the actual money collected (Paid Fees)
        const feeCollection = invoices.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);

        // Fetch Paid Expenses
        const paidExpenses = await Expense.aggregate([
            { $match: { status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalExpenses = paidExpenses.length > 0 ? paidExpenses[0].total : 0;

        // Net Revenue = Collected Fees - Paid Expenses
        const totalRevenue = feeCollection - totalExpenses;

        // Correctly calculate pending fees
        const pendingFees = invoices.reduce((acc, curr) => {
            if (curr.status === 'paid') return acc;
            const remaining = curr.remainingBalance !== undefined ? curr.remainingBalance : curr.amount;
            return acc + (remaining || 0);
        }, 0);

        // 3. Fee Collection by Class (for BarChart)
        const feeByClass = await FeeInvoice.aggregate([
            {
                $project: {
                    amount: 1,
                    paidAmount: 1,
                    remainingBalance: 1,
                    status: 1,
                    normalizedClass: { $toUpper: { $trim: { input: { $ifNull: ["$class", "Unknown"] } } } }
                }
            },
            {
                $group: {
                    _id: "$normalizedClass",
                    total: { $sum: "$amount" },
                    collected: { $sum: "$paidAmount" },
                    pending: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "paid"] },
                                0,
                                { $ifNull: ["$remainingBalance", "$amount"] }
                            ]
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const feeDataMap = {};
        feeByClass.forEach(item => {
            let className = (item._id || 'Unknown').toUpperCase().trim();
            // Normalize Roman Numerals to digits for consistency
            className = className.replace(/\bI\b/g, '1')
                .replace(/\bII\b/g, '2')
                .replace(/\bIII\b/g, '3')
                .replace(/\bIV\b/g, '4')
                .replace(/\bV\b/g, '5');

            if (!feeDataMap[className]) {
                feeDataMap[className] = {
                    class: className,
                    total: 0,
                    collected: 0,
                    pending: 0
                };
            }
            feeDataMap[className].total += item.total;
            feeDataMap[className].collected += item.collected;
            feeDataMap[className].pending += item.pending;
        });

        const feeData = Object.values(feeDataMap).slice(0, 5); // Just top 5 for the dashboard

        // 4. Student Growth (Last 6 Months)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const studentGrowthData = [];
        let monthlyGrowth = 0;

        // Generate last 6 months range
        const monthsRange = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            monthsRange.push({
                month: d.getMonth() + 1,
                year: d.getFullYear(),
                label: monthNames[d.getMonth()]
            });
        }

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const growthData = await Student.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Calculate starting cumulative count (total minus what's in the growth window)
        const totalNewInWindow = growthData.reduce((acc, curr) => acc + curr.count, 0);
        let cumulative = totalStudents - totalNewInWindow;

        monthsRange.forEach((m, index) => {
            const found = growthData.find(g => g._id.month === m.month && g._id.year === m.year);
            const count = found ? found.count : 0;
            cumulative += count;

            if (index === monthsRange.length - 1) {
                monthlyGrowth = count;
            }

            studentGrowthData.push({
                month: m.label,
                students: cumulative
            });
        });

        // 5. Recent Applications (for table)
        const recentApplications = await Student.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const formattedApplications = recentApplications.map(app => ({
            id: app._id,
            studentName: `${app.FirstName || ''} ${app.LastName || ''}`.trim(),
            class: app.AdmissionClass || 'N/A',
            fatherName: app.fatherName || 'N/A',
            date: new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: app.status
        }));

        res.json({
            stats: {
                totalStudents,
                totalTeachers,
                totalClasses,
                totalRevenue, // Now Net Revenue
                feeCollection,
                totalExpenses,
                totalReceivable,
                pendingFees,
                newApplications,
                monthlyGrowth
            },
            feeData,
            studentGrowthData,
            recentApplications: formattedApplications
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats
};
