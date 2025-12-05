import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChartBar,
    faChartPie,
    faChartLine,
    faDownload,
    faCalendarAlt,
    faUserGraduate,
    faMoneyBillWave,
    faChalkboardTeacher,
    faPrint
} from '@fortawesome/free-solid-svg-icons'

const AdminReports = () => {
    const [reportType, setReportType] = useState('academic')
    const [dateRange, setDateRange] = useState('month')

    // Mock Data for Charts (Visual representation using CSS widths/heights)
    const academicData = [
        { subject: 'Math', score: 85, color: 'bg-blue-500' },
        { subject: 'Science', score: 78, color: 'bg-green-500' },
        { subject: 'English', score: 92, color: 'bg-purple-500' },
        { subject: 'History', score: 88, color: 'bg-yellow-500' },
        { subject: 'Art', score: 95, color: 'bg-pink-500' }
    ]

    const attendanceData = [
        { label: 'Present', value: 85, color: 'bg-green-500' },
        { label: 'Absent', value: 10, color: 'bg-red-500' },
        { label: 'Late', value: 5, color: 'bg-yellow-500' }
    ]

    const financialData = [
        { month: 'Jan', revenue: 65, expense: 40 },
        { month: 'Feb', revenue: 70, expense: 45 },
        { month: 'Mar', revenue: 85, expense: 50 },
        { month: 'Apr', revenue: 75, expense: 42 },
        { month: 'May', revenue: 90, expense: 55 },
        { month: 'Jun', revenue: 95, expense: 60 }
    ]

    const renderAcademicReport = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Average GPA</h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-blue-600">3.6</span>
                        <span className="text-gray-500 mb-1">/ 4.0</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                        <FontAwesomeIcon icon={faChartLine} className="mr-1" />
                        +0.2 from last term
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Pass Rate</h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-green-600">94%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                        <FontAwesomeIcon icon={faChartLine} className="mr-1" />
                        +2% from last term
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top Subject</h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-purple-600">Art</span>
                    </div>
                    <p className="text-gray-600">Average Score: 95%</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Lowest: Science (78%)
                    </p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Subject Performance Overview</h3>
                <div className="space-y-4">
                    {academicData.map((item) => (
                        <div key={item.subject}>
                            <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                                <span>{item.subject}</span>
                                <span>{item.score}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-500 ${item.color}`}
                                    style={{ width: `${item.score}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    const renderFinancialReport = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-green-600">$125,000</p>
                    <p className="text-sm text-gray-500 mt-1">This Academic Year</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Total Expenses</h3>
                    <p className="text-3xl font-bold text-red-600">$85,000</p>
                    <p className="text-sm text-gray-500 mt-1">This Academic Year</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Net Profit</h3>
                    <p className="text-3xl font-bold text-blue-600">$40,000</p>
                    <p className="text-sm text-gray-500 mt-1">This Academic Year</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue vs Expenses</h3>
                <div className="flex items-end justify-between h-64 gap-4">
                    {financialData.map((item) => (
                        <div key={item.month} className="flex-1 flex flex-col justify-end gap-1 group">
                            <div className="relative flex gap-1 h-full items-end justify-center">
                                <div
                                    className="w-3 md:w-6 bg-green-500 rounded-t-lg transition-all duration-300 group-hover:bg-green-600"
                                    style={{ height: `${item.revenue}%` }}
                                    title={`Revenue: $${item.revenue}k`}
                                ></div>
                                <div
                                    className="w-3 md:w-6 bg-red-500 rounded-t-lg transition-all duration-300 group-hover:bg-red-600"
                                    style={{ height: `${item.expense}%` }}
                                    title={`Expense: $${item.expense}k`}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500 text-center font-medium">{item.month}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-6 mt-6">
                    <div className="flex items-center text-sm text-gray-600">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        Revenue
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        Expenses
                    </div>
                </div>
            </div>
        </div>
    )

    const renderAttendanceReport = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Daily Attendance Distribution</h3>
                    <div className="flex items-center justify-center">
                        <div className="relative w-48 h-48 rounded-full border-8 border-gray-100 flex items-center justify-center">
                            {/* Simple CSS Pie Chart Representation */}
                            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="3"
                                    strokeDasharray="10, 100"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#eab308"
                                    strokeWidth="3"
                                    strokeDasharray="5, 100"
                                    strokeDashoffset="-10"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#22c55e"
                                    strokeWidth="3"
                                    strokeDasharray="85, 100"
                                    strokeDashoffset="-15"
                                />
                            </svg>
                            <div className="absolute text-center">
                                <span className="text-3xl font-bold text-gray-800">85%</span>
                                <p className="text-xs text-gray-500">Present</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-6">
                        {attendanceData.map((item) => (
                            <div key={item.label} className="flex items-center text-sm text-gray-600">
                                <div className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></div>
                                {item.label} ({item.value}%)
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Best Attendance Class</h3>
                        <p className="text-2xl font-bold text-blue-600">Class 10A</p>
                        <p className="text-sm text-gray-500 mt-1">98% Average Attendance</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Lowest Attendance Class</h3>
                        <p className="text-2xl font-bold text-orange-600">Class 8B</p>
                        <p className="text-sm text-gray-500 mt-1">82% Average Attendance</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Staff Attendance</h3>
                        <p className="text-2xl font-bold text-purple-600">96%</p>
                        <p className="text-sm text-gray-500 mt-1">Teaching & Non-teaching</p>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Reports & Analytics
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Comprehensive insights into school performance
                    </p>
                </div>
                <div className="flex gap-3">
                    <select
                        className="bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="term">This Term</option>
                        <option value="year">This Year</option>
                    </select>
                    <button className="bg-white text-gray-600 px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center">
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        Print
                    </button>
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center">
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Export
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 border border-gray-100 inline-flex flex-wrap gap-2">
                <button
                    onClick={() => setReportType('academic')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center ${reportType === 'academic'
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <FontAwesomeIcon icon={faUserGraduate} className="mr-2" />
                    Academic
                </button>
                <button
                    onClick={() => setReportType('financial')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center ${reportType === 'financial'
                            ? 'bg-green-50 text-green-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                    Financial
                </button>
                <button
                    onClick={() => setReportType('attendance')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center ${reportType === 'attendance'
                            ? 'bg-purple-50 text-purple-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    Attendance
                </button>
            </div>

            {/* Content Area */}
            <div className="animate-fade-in">
                {reportType === 'academic' && renderAcademicReport()}
                {reportType === 'financial' && renderFinancialReport()}
                {reportType === 'attendance' && renderAttendanceReport()}
            </div>
        </div>
    )
}

export default AdminReports
