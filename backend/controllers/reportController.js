const Student = require('../models/Student');
const FeeInvoice = require('../models/FeeInvoice');
const Expense = require('../models/Expense');
const Result = require('../models/Result');
const Class = require('../models/Class');

// @desc    Get stats for reports page
// @route   GET /api/reports/stats
// @access  Private/Admin
const getReportStats = async (req, res) => {
    try {
        const { range } = req.query;
        let startDate = new Date(0); // Default to all time

        const now = new Date();
        if (range === 'week') {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (range === 'month') {
            startDate = new Date(now.setMonth(now.getMonth() - 1));
        } else if (range === 'term') {
            startDate = new Date(now.setMonth(now.getMonth() - 4)); // Assume 4 months for term
        } else if (range === 'year') {
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        }

        // 1. Academic Stats
        const results = await Result.find({
            createdAt: { $gte: startDate }
        }).lean();

        let academicStats = {
            avgPercentage: 0,
            passRate: 0,
            topSubject: 'N/A',
            topSubjectScore: 0,
            lowestSubject: 'N/A',
            lowestSubjectScore: 0,
            subjectPerformance: []
        };

        const testSubjects = ['Mathematics', 'Science', 'History', 'English'];

        if (results.length > 0) {
            const totalPercentage = results.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
            academicStats.avgPercentage = Math.round(totalPercentage / results.length);

            const passedCount = results.filter(r => r.resultStatus && r.resultStatus.toLowerCase() === 'pass').length;
            academicStats.passRate = Math.round((passedCount / results.length) * 100);

            // Aggregate subject performance
            const subjectStats = {};
            results.forEach(r => {
                if (r.marks && Array.isArray(r.marks)) {
                    r.marks.forEach(m => {
                        // Skip test subjects
                        if (testSubjects.includes(m.subject)) return;

                        if (!subjectStats[m.subject]) {
                            subjectStats[m.subject] = { totalObtained: 0, totalMax: 0 };
                        }
                        subjectStats[m.subject].totalObtained += (m.obtainedMarks || 0);
                        subjectStats[m.subject].totalMax += (m.totalMarks || 100);
                    });
                }
            });


            const performance = Object.keys(subjectStats).map(subject => {
                const totalMax = subjectStats[subject].totalMax || 1;
                const score = Math.round((subjectStats[subject].totalObtained / totalMax) * 100);
                return {
                    subject,
                    score,
                    color: score >= 90 ? 'bg-pink-500' : score >= 80 ? 'bg-purple-500' : score >= 70 ? 'bg-blue-500' : 'bg-yellow-500'
                };
            }).sort((a, b) => b.score - a.score);

            academicStats.subjectPerformance = performance;
            if (performance.length > 0) {
                academicStats.topSubject = performance[0].subject;
                academicStats.topSubjectScore = performance[0].score;
                academicStats.lowestSubject = performance[performance.length - 1].subject;
                academicStats.lowestSubjectScore = performance[performance.length - 1].score;
            }
        }


        // 2. Financial Stats
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const financialData = [];
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        // Fetch enough data for the 6-month chart
        const invoices = await FeeInvoice.find({
            createdAt: { $gte: sixMonthsAgo }
        }).lean();

        const expenses = await Expense.find({
            date: { $gte: sixMonthsAgo },
            status: 'Paid'
        }).lean();

        let totalRevenueSum = 0;
        let totalExpenseSum = 0;

        // Totals should be based on range, but chart is always 6 months
        const rangeInvoices = invoices.filter(inv => new Date(inv.createdAt) >= startDate);
        const rangeExpenses = expenses.filter(exp => new Date(exp.date) >= startDate);

        const rangeRevenue = rangeInvoices.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
        const rangeExpense = rangeExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const m = d.getMonth();
            const y = d.getFullYear();

            const monthlyRevenue = invoices
                .filter(inv => new Date(inv.createdAt).getMonth() === m && new Date(inv.createdAt).getFullYear() === y)
                .reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);

            const monthlyExpense = expenses
                .filter(exp => new Date(exp.date).getMonth() === m && new Date(exp.date).getFullYear() === y)
                .reduce((acc, curr) => acc + (curr.amount || 0), 0);

            financialData.push({
                month: monthNames[m],
                revenue: Math.round(monthlyRevenue / 1000), // K scale for chart
                expense: Math.round(monthlyExpense / 1000)
            });
        }

        // 3. Attendance Stats
        const students = await Student.find({ status: { $in: ['approved', 'active'] } }).lean();
        let presentCount = 0;
        let absentCount = 0;
        let lateCount = 0;
        let totalRecords = 0;

        const classAttendance = {};

        students.forEach(s => {
            if (s.attendance && s.attendance.length > 0) {
                // Filter attendance by range
                const filteredAttendance = s.attendance.filter(a => new Date(a.date) >= startDate);

                if (filteredAttendance.length > 0) {
                    filteredAttendance.forEach(record => {
                        if (record.status === 'present') presentCount++;
                        else if (record.status === 'absent') absentCount++;
                        else if (record.status === 'late') lateCount++;
                        totalRecords++;

                        const className = s.CurrentClass || 'Unknown';
                        if (!classAttendance[className]) {
                            classAttendance[className] = { total: 0, present: 0 };
                        }
                        classAttendance[className].total++;
                        if (record.status === 'present' || record.status === 'late') {
                            classAttendance[className].present++;
                        }
                    });
                }
            }
        });

        const attendanceStats = {
            distribution: [
                { label: 'Present', value: totalRecords ? Math.round((presentCount / totalRecords) * 100) : 0, color: 'bg-green-500', stroke: '#22c55e' },
                { label: 'Absent', value: totalRecords ? Math.round((absentCount / totalRecords) * 100) : 0, color: 'bg-red-500', stroke: '#ef4444' },
                { label: 'Late', value: totalRecords ? Math.round((lateCount / totalRecords) * 100) : 0, color: 'bg-yellow-500', stroke: '#eab308' }
            ],
            bestClass: 'N/A',
            bestRate: 0,
            lowestClass: 'N/A',
            lowestRate: 0
        };


        const classRates = Object.keys(classAttendance).map(cls => ({
            name: cls,
            rate: Math.round((classAttendance[cls].present / classAttendance[cls].total) * 100)
        })).sort((a, b) => b.rate - a.rate);

        if (classRates.length > 0) {
            attendanceStats.bestClass = classRates[0].name;
            attendanceStats.bestRate = classRates[0].rate;
            attendanceStats.lowestClass = classRates[classRates.length - 1].name;
            attendanceStats.lowestRate = classRates[classRates.length - 1].rate;
        }

        res.json({
            academicStats,
            financialData,
            totalRevenue: rangeRevenue,
            totalExpenses: rangeExpense,
            netProfit: rangeRevenue - rangeExpense,

            attendanceStats
        });

    } catch (error) {
        console.error('Error fetching report stats:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReportStats
};
