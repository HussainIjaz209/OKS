import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '../../contexts/AuthContext'
import {
    faSearch,
    faFilter,
    faUserGraduate,
    faEllipsisV,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faChartLine,
    faCheckCircle,
    faTimesCircle,
    faUser,
    faGraduationCap,
    faUsers,
    faSpinner
} from '@fortawesome/free-solid-svg-icons'

const Students = () => {
    const { user } = useAuth()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedClass, setSelectedClass] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState('grid')

    useEffect(() => {
        const fetchStudents = async () => {
            if (!user || !user.teacherId) {
                setError('Teacher ID not found in user profile')
                setLoading(false)
                return
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/teachers/${user.teacherId}/students`)
                if (!response.ok) {
                    throw new Error('Failed to fetch students')
                }
                const data = await response.json()
                setStudents(data)
            } catch (err) {
                console.error('Error fetching students:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchStudents()
    }, [user])

    // Derive available classes from the students data
    const classes = Array.from(new Set(students.map(s => s.class))).sort()

    const filteredStudents = students.filter(student => {
        const matchesClass = selectedClass === 'all' || student.class === selectedClass
        const name = student.name || ''
        const rollNo = String(student.rollNo || '')

        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rollNo.includes(searchQuery)
        return matchesClass && matchesSearch
    })

    const getPerformanceColor = (score) => {
        if (score >= 90) return 'text-green-600'
        if (score >= 75) return 'text-blue-600'
        if (score >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getAttendanceColor = (percentage) => {
        if (percentage >= 90) return 'text-green-600'
        if (percentage >= 75) return 'text-blue-600'
        if (percentage >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Loading students...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
                    <FontAwesomeIcon icon={faTimesCircle} className="text-4xl text-red-500 mb-4" />
                    <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Students</h3>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    My Students
                </h1>
                <p className="text-gray-600 text-lg">
                    Manage and monitor student performance across your classes
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Students</p>
                            <h3 className="text-3xl font-bold text-gray-800">{students.length}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            <FontAwesomeIcon icon={faUsers} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Average Attendance</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {students.length > 0
                                    ? Math.round(students.reduce((acc, curr) => acc + curr.attendance, 0) / students.length)
                                    : 0}%
                            </h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl text-green-600">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Class Performance</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {students.length > 0
                                    ? Math.round(students.reduce((acc, curr) => acc + curr.performance, 0) / students.length)
                                    : 0}%
                            </h3>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                            <FontAwesomeIcon icon={faChartLine} className="text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative">
                            <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 font-medium appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="all">All Classes</option>
                                {classes.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="relative w-full md:w-64">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                    <div key={student.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-blue-500 to-purple-500 mb-4 group-hover:scale-105 transition-transform duration-300">
                                <img
                                    src={student.image}
                                    alt={student.name}
                                    className="w-full h-full rounded-full object-cover border-4 border-white"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{student.name}</h3>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-2">
                                {student.class} • Roll No: {student.rollNo}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Attendance</p>
                                <p className={`text-lg font-bold ${getAttendanceColor(student.attendance)}`}>
                                    {student.attendance}%
                                </p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Performance</p>
                                <p className={`text-lg font-bold ${getPerformanceColor(student.performance)}`}>
                                    {student.performance}%
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center text-gray-600 text-sm">
                                <FontAwesomeIcon icon={faEnvelope} className="w-5 text-gray-400 mr-3" />
                                {student.email}
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                                <FontAwesomeIcon icon={faPhone} className="w-5 text-gray-400 mr-3" />
                                {student.phone}
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-colors text-sm">
                                View Profile
                            </button>
                            <button className="flex-1 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-600 py-2 rounded-xl font-medium transition-all text-sm">
                                Message
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStudents.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">No students found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search query</p>
                </div>
            )}
        </div>
    )
}

export default Students
