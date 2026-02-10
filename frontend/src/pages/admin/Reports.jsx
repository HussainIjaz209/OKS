import { useState, useEffect } from 'react'
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
    faPrint,
    faSpinner,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { API_BASE_URL } from '../../apiConfig'
const API_URL = `${API_BASE_URL}/api`


const AdminReports = () => {
    const [reportType, setReportType] = useState('academic')
    const [dateRange, setDateRange] = useState('month')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [reportData, setReportData] = useState(null)

    useEffect(() => {
        fetchReportStats()
    }, [dateRange])

    const fetchReportStats = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${API_URL}/reports/stats?range=${dateRange}`)
            setReportData(response.data)
            setError(null)
        } catch (err) {
            console.error('Error fetching report stats:', err)
            setError('Failed to load report data. Please try again later.')
        } finally {
            setLoading(false)
        }
    }


    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-blue-600 mb-4" />
                <p className="text-gray-600 font-medium">Loading reports and analytics...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md border border-red-100">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchReportStats}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    const { academicStats, financialData, totalRevenue, totalExpenses, netProfit, attendanceStats } = reportData

    const renderAcademicReport = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Average Percentage</h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-blue-600">{academicStats.avgPercentage || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${academicStats.avgPercentage || 0}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                        Based on current term results
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Pass Rate</h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-green-600">{academicStats.passRate || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${academicStats.passRate || 0}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {academicStats.passRate >= 70 ? 'Excellent performance' : 'Requires attention'}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top Subject</h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-purple-600 truncate max-w-full">
                            {academicStats.topSubject === 'N/A' ? 'None' : academicStats.topSubject}
                        </span>
                    </div>
                    <p className="text-gray-600">
                        {academicStats.topSubject === 'N/A' ? 'No data' : `Average Score: ${academicStats.topSubjectScore}%`}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        {academicStats.lowestSubject === 'N/A' ? '' : `Lowest: ${academicStats.lowestSubject} (${academicStats.lowestSubjectScore}%)`}
                    </p>
                </div>

            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Subject Performance Overview</h3>
                <div className="space-y-4">
                    {academicStats.subjectPerformance.length > 0 ? (
                        academicStats.subjectPerformance.map((item) => (
                            <div key={item.subject}>
                                <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                                    <span>{item.subject}</span>
                                    <span>{item.score}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-1000 ${item.color}`}
                                        style={{ width: `${item.score}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No subject performance data available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    const renderFinancialReport = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-green-600">Rs. {totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">Last 6 Months</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Total Expenses</h3>
                    <p className="text-3xl font-bold text-red-600">Rs. {totalExpenses.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">Last 6 Months</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Net Profit</h3>
                    <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                        Rs. {netProfit.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Last 6 Months</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue vs Expenses (Last 6 Months)</h3>
                <div className="flex items-end justify-between h-64 gap-4">
                    {financialData.map((item) => {
                        const maxVal = Math.max(...financialData.map(f => Math.max(f.revenue, f.expense)), 10)
                        const revHeight = (item.revenue / maxVal) * 100
                        const expHeight = (item.expense / maxVal) * 100

                        return (
                            <div key={item.month} className="flex-1 flex flex-col justify-end gap-1 group">
                                <div className="relative flex gap-1 h-full items-end justify-center">
                                    <div
                                        className="w-3 md:w-6 bg-green-500 rounded-t-lg transition-all duration-500 group-hover:bg-green-600"
                                        style={{ height: `${revHeight}%` }}
                                        title={`Revenue: Rs. ${item.revenue}k`}
                                    ></div>
                                    <div
                                        className="w-3 md:w-6 bg-red-500 rounded-t-lg transition-all duration-500 group-hover:bg-red-600"
                                        style={{ height: `${expHeight}%` }}
                                        title={`Expense: Rs. ${item.expense}k`}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500 text-center font-medium mt-2">{item.month}</span>
                            </div>
                        )
                    })}
                </div>
                <div className="flex justify-center gap-6 mt-8">
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
                            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                {attendanceStats.distribution.map((item, index) => {
                                    const prevValues = attendanceStats.distribution.slice(0, index).reduce((acc, curr) => acc + curr.value, 0)
                                    return (
                                        <path
                                            key={item.label}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke={item.stroke}
                                            strokeWidth="3"
                                            strokeDasharray={`${item.value}, 100`}
                                            strokeDashoffset={`-${prevValues}`}
                                            className="transition-all duration-1000"
                                        />
                                    )
                                })}
                            </svg>
                            <div className="absolute text-center">
                                <span className="text-3xl font-bold text-gray-800">
                                    {attendanceStats.distribution.find(i => i.label === 'Present')?.value || 0}%
                                </span>
                                <p className="text-xs text-gray-400">Present Today</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-8">
                        {attendanceStats.distribution.map((item) => (
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
                        <p className="text-2xl font-bold text-blue-600">{attendanceStats.bestClass}</p>
                        <p className="text-sm text-gray-500 mt-1">{attendanceStats.bestRate}% Average Attendance</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Lowest Attendance Class</h3>
                        <p className="text-2xl font-bold text-orange-600">{attendanceStats.lowestClass}</p>
                        <p className="text-sm text-gray-500 mt-1">{attendanceStats.lowestRate}% Average Attendance</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Overall Statistics</h3>
                        <div className="flex justify-between items-center mt-2">
                            <div>
                                <p className="text-2xl font-bold text-purple-600">
                                    {attendanceStats.distribution.find(i => i.label === 'Present')?.value || 0}%
                                </p>
                                <p className="text-xs text-gray-500">Avg Presence</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-red-600">
                                    {attendanceStats.distribution.find(i => i.label === 'Absent')?.value || 0}%
                                </p>
                                <p className="text-xs text-gray-500">Avg Absence</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 pb-20">
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
                    <button
                        onClick={() => window.print()}
                        className="bg-white text-gray-600 px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center"
                    >
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        Print
                    </button>
                    <button
                        onClick={fetchReportStats}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center"
                    >
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Refresh
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
            <div className="animate-fade-in transition-all duration-300">
                {reportType === 'academic' && renderAcademicReport()}
                {reportType === 'financial' && renderFinancialReport()}
                {reportType === 'attendance' && renderAttendanceReport()}
            </div>
        </div>
    )
}

export default AdminReports

