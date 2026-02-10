import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '../../contexts/AuthContext'
import {
  faUserCheck,
  faCalendarCheck,
  faReceipt,
  faTrophy,
  faClock,
  faChalkboardTeacher,
  faTrophy as faTrophySolid,
  faCalendarDay,
  faUsers,
  faGraduationCap,
  faChartLine,
  faBullseye,
  faCalendar,
  faBook
} from '@fortawesome/free-solid-svg-icons'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [studentStats, setStudentStats] = useState({
    name: user?.name || 'Student',
    class: '...',
    rollNo: '...',
    section: '...',
    attendance: '0%',
    fees: { total: 0, paid: 0, pending: 0, dueDate: 'N/A' },
    isRestricted: false,
    hasAdmissionFee: false,
    upcomingEvents: [],
    subjects: [],
    performanceData: []
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const studentId = user?.studentId || user?.id || user?._id;

        if (!studentId || studentId === 'null') {
          console.warn('Dashboard: Missing valid student ID');
          setLoading(false);
          return;
        }

        // 1. Fetch Profile Data
        const profileRes = await fetch(`${API_BASE_URL}/api/students/profile/${studentId}`)
        const profileData = await profileRes.json()

        // 2. Fetch Fee Data (if studentId exists)
        let feeStats = { total: 0, paid: 0, pending: 0, dueDate: 'N/A' }
        let hasPendingAdmissionFee = false
        if (profileData.studentId) {
          const feeRes = await fetch(`${API_BASE_URL}/api/fees/invoices?studentId=${profileData.studentId}`)
          const invoices = await feeRes.json()

          if (Array.isArray(invoices)) {
            feeStats.total = invoices.reduce((acc, inv) => acc + (inv.amount || 0), 0)
            feeStats.paid = invoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0)
            feeStats.pending = invoices.reduce((acc, inv) => {
              if (inv.status === 'paid') return acc;
              // Check for Admission Fee
              if (inv.type === 'Admission Fee' || inv.description?.toLowerCase().includes('admission')) {
                hasPendingAdmissionFee = true;
              }
              return acc + (inv.remainingBalance !== undefined ? inv.remainingBalance : inv.amount);
            }, 0)

            const nextInvoice = invoices.find(inv => inv.status !== 'paid')
            if (nextInvoice) {
              feeStats.dueDate = new Date(nextInvoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }
          }
        }

        // Restriction Check: > 5000 or pending Admission Fee
        const isRestricted = feeStats.pending > 5000 || hasPendingAdmissionFee;

        // Fetch other data only if not restricted
        let subjects = []
        let performanceData = []
        let nextExam = 'N/A'
        let upcomingEvents = []

        if (!isRestricted) {
          // 4. Fetch Exams & Results
          try {
            const examsRes = await fetch(`${API_BASE_URL}/api/exams/my-exams/${studentId}`)
            const examsData = await examsRes.json()
            const upcomingExams = (examsData.success && Array.isArray(examsData.data)) ? examsData.data : []
            const foundExam = upcomingExams
              .filter(ex => new Date(ex.date) >= new Date())
              .sort((a, b) => new Date(a.date) - new Date(b.date))[0]
            if (foundExam) nextExam = `${foundExam.title} - ${new Date(foundExam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
          } catch (e) { console.error(e) }

          try {
            const resultsRes = await fetch(`${API_BASE_URL}/api/exams/my-results/${studentId}`)
            const resultsData = await resultsRes.json()
            const academicResults = (Array.isArray(resultsData)) ? resultsData : []

            subjects = academicResults.map(r => ({
              name: r.exam?.title || r.subject || 'N/A',
              marks: r.marks || 0,
              grade: r.marks >= 90 ? 'A' : r.marks >= 80 ? 'B' : r.marks >= 70 ? 'C' : 'D',
              teacher: r.teacherName || 'N/A'
            }))

            performanceData = academicResults.slice(-6).map(r => ({
              month: new Date(r.createdAt).toLocaleString('default', { month: 'short' }),
              marks: r.marks
            }))
          } catch (e) { console.error(e) }

          try {
            const eventsRes = await fetch(`${API_BASE_URL}/api/events`)
            const eventsData = await eventsRes.json()
            upcomingEvents = (Array.isArray(eventsData) ? eventsData : [])
              .filter(e => new Date(e.date) >= new Date())
              .slice(0, 3)
              .map(e => ({
                name: e.title,
                date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                type: 'event'
              }))
          } catch (e) { console.error(e) }
        }

        setStudentStats({
          name: profileData.name || user?.name,
          class: profileData.class || 'N/A',
          rollNo: profileData.rollNumber || 'N/A',
          section: profileData.section || 'N/A',
          attendance: profileData.attendance || '0%',
          nextExam: nextExam,
          fees: feeStats,
          isRestricted,
          hasAdmissionFee: hasPendingAdmissionFee,
          upcomingEvents: upcomingEvents,
          subjects: subjects.length > 0 ? subjects : [],
          performanceData: performanceData.length > 0 ? performanceData : []
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id || user?.studentId) {
      fetchDashboardData()
    }
  }, [user])

  const studentData = studentStats

  const performanceData = studentData.performanceData.length > 0
    ? studentData.performanceData
    : [
      { month: 'Jan', marks: 0 },
      { month: 'Feb', marks: 0 },
      { month: 'Mar', marks: 0 },
      { month: 'Apr', marks: 0 },
      { month: 'May', marks: 0 },
      { month: 'Jun', marks: 0 }
    ]

  const gradeCounts = studentData.subjects.reduce((acc, sub) => {
    acc[sub.grade] = (acc[sub.grade] || 0) + 1
    return acc
  }, {})

  const gradeData = [
    { name: 'A', value: gradeCounts['A'] || 0, color: '#10b981' },
    { name: 'B', value: gradeCounts['B'] || 0, color: '#3b82f6' },
    { name: 'C', value: gradeCounts['C'] || 0, color: '#f59e0b' },
    { name: 'D', value: gradeCounts['D'] || 0, color: '#ef4444' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25'
      case 'B': return 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25'
      case 'C': return 'bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg shadow-yellow-500/25'
      case 'D': return 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25'
      default: return 'bg-gradient-to-br from-blue-500 to-blue-600'
    }
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'competition': return faTrophySolid
      case 'event': return faCalendarDay
      case 'meeting': return faUsers
      default: return faCalendar
    }
  }

  const getEventIconColor = (type) => {
    switch (type) {
      case 'competition': return 'text-blue-600'
      case 'event': return 'text-green-600'
      case 'meeting': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const getEventBg = (type) => {
    switch (type) {
      case 'competition': return 'bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500'
      case 'event': return 'bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500'
      case 'meeting': return 'bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500'
      default: return 'bg-gradient-to-br from-gray-50 to-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome back, {studentData.name}!
        </h1>
        <p className="text-gray-600 text-lg">
          Class {studentData.class} • Section {studentData.section} • Roll No: {studentData.rollNo}
        </p>

        {studentData.isRestricted && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-md animate-pulse">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-red-800 uppercase tracking-wide">
                  Account Restricted
                </p>
                <p className="text-sm text-red-700 mt-1">
                  {studentData.hasAdmissionFee
                    ? "Your Admission Fee is pending. Please clear your dues to access your academic records and dashboard."
                    : "Your outstanding dues exceed $5,000. Please clear your balance to access full dashboard features."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${studentData.isRestricted ? 'lg:grid-cols-2 max-w-2xl' : 'lg:grid-cols-4'} gap-6 mb-8`}>
        {!studentData.isRestricted && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <FontAwesomeIcon icon={faUserCheck} className="text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-blue-100 text-sm font-medium">Attendance</p>
                <p className="text-3xl font-bold">{studentData.attendance}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-400/30">
              <p className="text-blue-100 text-sm">Excellent attendance!</p>
            </div>
          </div>
        )}

        {!studentData.isRestricted && (
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <FontAwesomeIcon icon={faCalendarCheck} className="text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-green-100 text-sm font-medium">Next Exam</p>
                <p className="text-lg font-bold">Mathematics</p>
                <p className="text-green-100 text-sm">Dec 20, 2024</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <FontAwesomeIcon icon={faReceipt} className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-orange-100 text-sm font-medium">Pending Fees</p>
              <p className="text-3xl font-bold">${studentData.fees.pending}</p>
              <p className="text-orange-100 text-sm">Due: {studentData.fees.dueDate}</p>
            </div>
          </div>
        </div>

        {!studentData.isRestricted ? (
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <FontAwesomeIcon icon={faTrophy} className="text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-purple-100 text-sm font-medium">Grade Average</p>
                <p className="text-3xl font-bold">A</p>
                <p className="text-purple-100 text-sm">Outstanding!</p>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => window.location.hash = '#/student/fees'}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col justify-center"
          >
            <p className="text-indigo-100 text-sm font-medium">Action Required</p>
            <p className="text-xl font-bold uppercase tracking-tighter mt-1">Pay Pending Fees</p>
            <p className="text-indigo-100 text-sm mt-2 flex items-center">
              Click to view details <FontAwesomeIcon icon={faReceipt} className="ml-2 animate-bounce" />
            </p>
          </div>
        )}
      </div>

      {/* Conditional Dashboard Sections */}
      {!studentData.isRestricted ? (
        <>
          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Performance Trend <FontAwesomeIcon icon={faChartLine} className="ml-2" />
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full">
                  <span className="text-blue-600 text-sm font-semibold">+14% Growth</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="marks"
                    stroke="url(#gradient)"
                    strokeWidth={4}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: '#1d4ed8' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="100%" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Grade Distribution <FontAwesomeIcon icon={faBullseye} className="ml-2" />
                </h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1 rounded-full">
                  <span className="text-green-600 text-sm font-semibold">{studentData.subjects.filter(s => s.grade === 'A').length} A Grades</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {gradeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Events & Recent Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Upcoming Events <FontAwesomeIcon icon={faCalendar} className="ml-2" />
                </h3>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-1 rounded-full">
                  <span className="text-purple-600 text-sm font-semibold">{studentData.upcomingEvents.length} Events</span>
                </div>
              </div>
              <div className="space-y-4">
                {studentData.upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`${getEventBg(event.type)} rounded-2xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={getEventIcon(event.type)}
                          className={`text-lg ${getEventIconColor(event.type)}`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{event.name}</p>
                        <p className="text-gray-600 text-sm flex items-center">
                          <FontAwesomeIcon icon={faClock} className="mr-2 text-gray-500" />
                          {event.date}
                        </p>
                      </div>
                      <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105">
                        Register
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Performance */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Subject Performance <FontAwesomeIcon icon={faBook} className="ml-2" />
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full">
                  <span className="text-blue-600 text-sm font-semibold">{studentData.subjects.length} Subjects</span>
                </div>
              </div>
              <div className="space-y-4">
                {studentData.subjects.slice(0, 4).map((subject, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{subject.name}</p>
                        <p className="text-gray-600 text-sm flex items-center">
                          <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2 text-gray-500" />
                          {subject.teacher}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`px-4 py-2 rounded-xl text-white font-bold ${getGradeColor(subject.grade)}`}>
                          {subject.grade}
                        </div>
                        <p className="text-gray-600 text-sm mt-2 font-semibold">{subject.marks}%</p>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${subject.grade === 'A' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                          subject.grade === 'B' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            'bg-gradient-to-r from-yellow-500 to-amber-600'
                          }`}
                        style={{ width: `${subject.marks}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-dashed border-gray-300">
          <div className="max-w-md mx-auto">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faReceipt} className="text-3xl text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Academic Records Locked</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              To view your full academic profile, subject performance, and school events, please settle your outstanding balance. Your education is our priority!
            </p>
            <button
              onClick={() => window.location.hash = '#/student/fees'}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 transform transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              Pay Now & Unlock
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard