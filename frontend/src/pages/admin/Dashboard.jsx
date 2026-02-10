import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartLine,
  faUsers,
  faChalkboardTeacher,
  faDollarSign,
  faFileAlt,
  faList,
  faEye,
  faCheck,
  faTimes,
  faCrown,
  faChartBar,
  faSchool,
  faClipboardList,
  faUserGraduate
} from '@fortawesome/free-solid-svg-icons'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    feeCollection: 0,
    pendingFees: 0,
    newApplications: 0
  })

  const [feeData, setFeeData] = useState([])
  const [studentGrowthData, setStudentGrowthData] = useState([])
  const [recentApplications, setRecentApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate();


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`)
        const data = await response.json()

        if (response.ok) {
          setStats(data.stats)
          setFeeData(data.feeData)
          setStudentGrowthData(data.studentGrowthData)
          setRecentApplications(data.recentApplications)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError('Failed to fetch dashboard data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const collectionData = [
    { name: 'Collected', value: stats.feeCollection, color: '#10b981' },
    { name: 'Pending', value: stats.pendingFees, color: '#ef4444' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-gradient-to-r from-green-500 to-emerald-600'
      case 'rejected': return 'bg-gradient-to-r from-red-500 to-red-600'
      case 'pending': return 'bg-gradient-to-r from-yellow-500 to-amber-600'
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">Loading dashboard statistics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Admin Dashboard Overview <FontAwesomeIcon icon={faCrown} className="ml-2" />
        </h1>
        <p className="text-gray-600 text-lg flex items-center">
          <FontAwesomeIcon icon={faChartLine} className="text-purple-500 mr-2" />
          Comprehensive overview of school operations and analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold">{stats.totalStudents.toLocaleString()}</p>
              <p className="text-blue-100 text-xs mt-1">+5% this month</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <FontAwesomeIcon icon={faUsers} className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Teachers</p>
              <p className="text-3xl font-bold">{stats.totalTeachers}</p>
              <p className="text-purple-100 text-xs mt-1">+2 new hires</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Net Revenue (Profit)</p>
              <p className="text-2xl font-bold">${(stats.totalRevenue || 0).toLocaleString()}</p>
              <p className="text-green-100 text-[10px] mt-1">
                Collected: ${(stats.feeCollection || 0).toLocaleString()} - Exp: ${(stats.totalExpenses || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <FontAwesomeIcon icon={faDollarSign} className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">New Applications</p>
              <p className="text-3xl font-bold">{stats.newApplications}</p>
              <p className="text-orange-100 text-xs mt-1">Pending review</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <FontAwesomeIcon icon={faFileAlt} className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Student Growth Chart */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Student Growth <FontAwesomeIcon icon={faChartLine} className="ml-2" />
            </h3>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1 rounded-full">
              <span className="text-green-600 text-sm font-semibold">{stats.monthlyGrowth > 0 ? `+${stats.monthlyGrowth}` : stats.monthlyGrowth} Students</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={studentGrowthData}>
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
                dataKey="students"
                stroke="url(#studentGrowth)"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#1d4ed8' }}
              />
              <defs>
                <linearGradient id="studentGrowth" x1="0" y1="0" x2="100%" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Fee Collection Pie Chart */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Fee Collection Status <FontAwesomeIcon icon={faDollarSign} className="ml-2" />
            </h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full">
              <span className="text-blue-600 text-sm font-semibold">
                {stats.totalReceivable > 0 ? ((stats.feeCollection / stats.totalReceivable) * 100).toFixed(1) : 0}% Collected
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={collectionData}
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
                {collectionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
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

      {/* Fee Collection Analytics */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Fee Collection by Class <FontAwesomeIcon icon={faSchool} className="ml-2" />
          </h3>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-1 rounded-full">
            <span className="text-purple-600 text-sm font-semibold">5 Classes</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={feeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="class"
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
              contentStyle={{
                background: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}
            />
            <Bar
              dataKey="collected"
              stackId="a"
              fill="url(#collectedGradient)"
              name="Collected"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pending"
              stackId="a"
              fill="url(#pendingGradient)"
              name="Pending"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="collectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Recent Applications <FontAwesomeIcon icon={faClipboardList} className="ml-2" />
            </h3>
            <p className="text-gray-600 text-sm mt-1">New student admission requests</p>
          </div>
          <button onClick={() => {
            navigate('admissions');
          }} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform flex items-center">
            <FontAwesomeIcon icon={faList} className="mr-2" />
            View All Applications
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 text-gray-700 font-semibold">Student Name</th>
                <th className="text-left py-4 px-4 text-gray-700 font-semibold">Class</th>
                <th className="text-left py-4 px-4 text-gray-700 font-semibold">Father's Name</th>
                <th className="text-left py-4 px-4 text-gray-700 font-semibold">Application Date</th>
                <th className="text-left py-4 px-4 text-gray-700 font-semibold">Status</th>
                <th className="text-left py-4 px-4 text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((application) => (
                <tr key={application.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                        <FontAwesomeIcon icon={faUserGraduate} className="text-xs" />
                      </div>
                      <span className="font-medium text-gray-800">{application.studentName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {application.class}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{application.fatherName}</td>
                  <td className="py-4 px-4 text-gray-600">{application.date}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-2 rounded-full text-xs font-bold text-white ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-blue-500 hover:text-white hover:scale-110">
                        <FontAwesomeIcon icon={faEye} className="text-xs" />
                      </button>
                      {application.status === 'pending' && (
                        <>
                          <button className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-green-500 hover:text-white hover:scale-110">
                            <FontAwesomeIcon icon={faCheck} className="text-xs" />
                          </button>
                          <button className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-red-500 hover:text-white hover:scale-110">
                            <FontAwesomeIcon icon={faTimes} className="text-xs" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard