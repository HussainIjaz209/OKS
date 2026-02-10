import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen,
  faUsers,
  faTasks,
  faCalendarCheck,
  faPercentage,
  faFileAlt,
  faCheck,
  faCalendar,
  faPlus,
  faUpload,
  faChartBar,
  faBell,
  faChartLine,
  faUserCheck,
  faBolt,
  faChalkboardTeacher,
  faSpinner,
  faBullhorn
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

const TeacherDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeAssignments: 0,
    classesToday: 0,
    avgAttendance: 94, // Placeholder for now or calculate from records
    managedClasses: []
  })
  const [recentAnnouncements, setRecentAnnouncements] = useState([])
  const [recentAssignments, setRecentAssignments] = useState([])
  const [todaySchedule, setTodaySchedule] = useState([])
  const [performanceData, setPerformanceData] = useState([])

  const fetchData = async () => {
    if (!user?.teacherId) return

    try {
      const [studentsRes, assignmentsRes, classesRes, timetableRes, announcementsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/teachers/${user.teacherId}/students`),
        fetch(`${API_BASE_URL}/api/assignments/teacher/${user.teacherId}`),
        fetch(`${API_BASE_URL}/api/teachers/managed-classes/${user.teacherId}`),
        fetch(`${API_BASE_URL}/api/teachers/timetable/${user.teacherId}`),
        fetch(`${API_BASE_URL}/api/announcements/teacher/${user.teacherId}`)
      ])

      const results = await Promise.allSettled([
        studentsRes.json(),
        assignmentsRes.json(),
        classesRes.json(),
        timetableRes.json(),
        announcementsRes.json()
      ])

      const studentsData = results[0].status === 'fulfilled' ? results[0].value : []
      const assignmentsData = results[1].status === 'fulfilled' ? results[1].value : []
      const managedData = results[2].status === 'fulfilled' ? results[2].value : []
      const timetableData = results[3].status === 'fulfilled' ? results[3].value : []
      const announcementsData = results[4].status === 'fulfilled' ? results[4].value : []

      // Process Performance Data for BarChart (simplified)
      const classesMap = {}
      if (Array.isArray(studentsData)) {
        studentsData.forEach(s => {
          const clsName = s.class || 'Unknown'
          if (!classesMap[clsName]) {
            classesMap[clsName] = { class: clsName, total: 0, count: 0 }
          }
          // Use attendance as a proxy for engagement or marks if not available
          classesMap[clsName].total += (s.attendance || 80)
          classesMap[clsName].count++
        })
      }

      const pData = Object.values(classesMap).map(c => ({
        class: c.class,
        average: Math.round(c.total / c.count)
      }))

      // Process Today's Schedule
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const today = days[new Date().getDay()]
      const ttArray = Array.isArray(timetableData) ? timetableData : []
      const classesToday = ttArray.filter(item => !item.day || item.day === today)

      setRecentAnnouncements(Array.isArray(announcementsData) ? announcementsData.slice(0, 3) : [])
      setRecentAssignments(Array.isArray(assignmentsData) ? assignmentsData.slice(0, 3) : [])

      // Filter today's schedule to identify next class
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const remainingClasses = classesToday.filter(slot => {
        if (!slot.startTime) return false;
        const [hours, minutes] = slot.startTime.split(':').map(Number);
        const slotStartTime = hours * 60 + minutes;
        // Keep class if it hasn't started yet OR if it's currently in progress
        // Actually, "Next" usually means the one starting soon. 
        // Let's keep all that haven't ended.
        const [endHours, endMinutes] = (slot.endTime || '23:59').split(':').map(Number);
        const slotEndTime = endHours * 60 + endMinutes;
        return slotEndTime > currentTime;
      });

      // Sort remaining by start time
      remainingClasses.sort((a, b) => a.startTime.localeCompare(b.startTime));

      setTodaySchedule(remainingClasses)

      setStats({
        totalStudents: Array.isArray(studentsData) ? studentsData.length : 0,
        activeAssignments: Array.isArray(assignmentsData) ? assignmentsData.length : 0,
        classesToday: classesToday.length, // Keep as total for the day
        remainingClasses: remainingClasses.length, // Add new stat
        avgAttendance: Array.isArray(studentsData) && studentsData.length > 0
          ? Math.round(studentsData.reduce((acc, s) => acc + (s.attendance || 0), 0) / studentsData.length)
          : 0,
        managedClasses: Array.isArray(managedData) ? managedData : []
      })
      setPerformanceData(pData.length > 0 ? pData : [
        { class: 'No Data', average: 0 }
      ])

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  const attendancePieData = [
    { name: 'Present', value: stats.avgAttendance, color: '#10b981' },
    { name: 'Absent', value: 100 - stats.avgAttendance, color: '#ef4444' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome back, {user?.name || 'Teacher'}! <FontAwesomeIcon icon={faChalkboardTeacher} className="ml-2" />
            </h1>
            <p className="text-gray-600 text-lg flex items-center">
              <FontAwesomeIcon icon={faBookOpen} className="text-purple-500 mr-2" />
              Teaching {user?.subject || 'All Subjects'} • {stats.managedClasses.map(c => `Class ${c.name}${c.section ? ' ' + c.section : ''}`).join(', ') || 'No managed classes'}
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
              <p className="text-gray-600 text-sm">Today's Schedule</p>
              <p className="text-gray-800 font-semibold">
                {stats.remainingClasses} Classes {todaySchedule.length > 0 ? `• Next: ${todaySchedule[0].subject}` : '• No more classes'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <FontAwesomeIcon icon={faUsers} className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-purple-100 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold">{stats.totalStudents}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-400/30">
            <p className="text-purple-100 text-sm">Across assigned classes</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <FontAwesomeIcon icon={faTasks} className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-blue-100 text-sm font-medium">Assignments</p>
              <p className="text-3xl font-bold">{stats.activeAssignments}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-400/30">
            <p className="text-blue-100 text-sm">Active tasks</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <FontAwesomeIcon icon={faCalendarCheck} className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-green-100 text-sm font-medium">Classes Today</p>
              <p className="text-3xl font-bold">{stats.classesToday}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-400/30">
            <p className="text-green-100 text-sm">Scheduled sessions</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <FontAwesomeIcon icon={faPercentage} className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-orange-100 text-sm font-medium">Avg Attendance</p>
              <p className="text-3xl font-bold">{stats.avgAttendance}%</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-orange-400/30">
            <p className="text-orange-100 text-sm">Academic year</p>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Class Performance <FontAwesomeIcon icon={faChartBar} className="ml-2" />
            </h3>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-1 rounded-full">
              <span className="text-purple-600 text-sm font-semibold">Average Scores</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="class"
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
              />
              <Bar
                dataKey="average"
                fill="url(#performanceGradient)"
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Attendance Overview <FontAwesomeIcon icon={faChartLine} className="ml-2" />
            </h3>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1 rounded-full">
              <span className="text-green-600 text-sm font-semibold">{stats.avgAttendance}% Present</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendancePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {attendancePieData.map((entry, index) => (
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

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Announcements */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Latest Announcements <FontAwesomeIcon icon={faBell} className="ml-2" />
            </h3>
            <Link to="/teacher/announcements" className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full text-blue-600 text-sm font-semibold hover:bg-blue-100 transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentAnnouncements.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent announcements</p>
            ) : (
              recentAnnouncements.map((ann) => (
                <div key={ann._id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                    <FontAwesomeIcon icon={faBullhorn} className="text-white text-lg" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 line-clamp-1">{ann.title}</p>
                    <p className="text-gray-600 text-sm line-clamp-1">{ann.content}</p>
                    <p className="text-blue-600 text-xs font-semibold mt-1">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Quick Actions <FontAwesomeIcon icon={faBolt} className="ml-2" />
            </h3>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-3 py-1 rounded-full">
              <span className="text-orange-600 text-sm font-semibold">Navigation</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/teacher/assignments" className="group bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform text-center">
              <FontAwesomeIcon
                icon={faPlus}
                className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300"
              />
              <p className="font-semibold text-sm">Add Assignment</p>
            </Link>

            <Link to="/teacher/attendance" className="group bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform text-center">
              <FontAwesomeIcon
                icon={faUserCheck}
                className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300"
              />
              <p className="font-semibold text-sm">Mark Attendance</p>
            </Link>

            <Link to="/teacher/materials" className="group bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform text-center">
              <FontAwesomeIcon
                icon={faUpload}
                className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300"
              />
              <p className="font-semibold text-sm">Upload Material</p>
            </Link>

            <Link to="/teacher/students" className="group bg-gradient-to-br from-orange-500 to-amber-600 text-white p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform text-center">
              <FontAwesomeIcon
                icon={faUsers}
                className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300"
              />
              <p className="font-semibold text-sm">My Students</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard