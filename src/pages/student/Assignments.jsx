import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTasks,
    faCheckCircle,
    faClock,
    faExclamationCircle,
    faFileAlt,
    faFileUpload,
    faFilter,
    faSearch,
    faChevronRight,
    faDownload,
    faCommentAlt,
    faPen,
    faCalendarAlt
} from '@fortawesome/free-solid-svg-icons'

const Assignments = () => {
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterSubject, setFilterSubject] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Mock Data
    const stats = {
        total: 24,
        pending: 5,
        submitted: 12,
        graded: 7,
        averageScore: 88
    }

    const assignments = [
        {
            id: 1,
            title: 'Calculus Problem Set 3',
            subject: 'Mathematics',
            teacher: 'Mr. Smith',
            dueDate: '2024-12-10',
            status: 'pending',
            description: 'Complete problems 1-15 from Chapter 4. Show all work.',
            points: 100,
            priority: 'high',
            timeLeft: '2 days'
        },
        {
            id: 2,
            title: 'Physics Lab Report: Motion',
            subject: 'Physics',
            teacher: 'Ms. Johnson',
            dueDate: '2024-12-12',
            status: 'in-progress',
            description: 'Write a detailed report on the projectile motion experiment.',
            points: 50,
            priority: 'medium',
            timeLeft: '4 days'
        },
        {
            id: 3,
            title: 'Essay: Shakespearean Tragedy',
            subject: 'English',
            teacher: 'Mrs. Davis',
            dueDate: '2024-12-05',
            status: 'submitted',
            submittedDate: '2024-12-04',
            description: 'Analyze the theme of ambition in Macbeth.',
            points: 100,
            priority: 'high',
            timeLeft: 'Submitted'
        },
        {
            id: 4,
            title: 'History Timeline Project',
            subject: 'History',
            teacher: 'Mr. Wilson',
            dueDate: '2024-11-30',
            status: 'graded',
            submittedDate: '2024-11-29',
            grade: 92,
            feedback: 'Excellent work on the visual elements. Good detail.',
            points: 100,
            priority: 'low',
            timeLeft: 'Completed'
        },
        {
            id: 5,
            title: 'Chemical Reactions Quiz',
            subject: 'Chemistry',
            teacher: 'Ms. White',
            dueDate: '2024-12-15',
            status: 'pending',
            description: 'Prepare for the upcoming quiz on balancing equations.',
            points: 20,
            priority: 'medium',
            timeLeft: '1 week'
        }
    ]

    const subjects = ['Mathematics', 'Physics', 'English', 'History', 'Chemistry']

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'submitted': return 'bg-purple-100 text-purple-700 border-purple-200'
            case 'graded': return 'bg-green-100 text-green-700 border-green-200'
            case 'overdue': return 'bg-red-100 text-red-700 border-red-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-500'
            case 'medium': return 'text-yellow-500'
            case 'low': return 'text-green-500'
            default: return 'text-gray-500'
        }
    }

    const filteredAssignments = assignments.filter(assignment => {
        const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus
        const matchesSubject = filterSubject === 'all' || assignment.subject === filterSubject
        const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.subject.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSubject && matchesSearch
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Assignments
                </h1>
                <p className="text-gray-600 text-lg">
                    Track your tasks, submissions, and grades
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            <FontAwesomeIcon icon={faTasks} className="text-xl" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.total}</h3>
                    <p className="text-sm text-gray-500 mt-1">Active assignments</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
                            <FontAwesomeIcon icon={faClock} className="text-xl" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Pending</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.pending}</h3>
                    <p className="text-sm text-gray-500 mt-1">Due soon</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-xl text-green-600">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Completed</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.submitted + stats.graded}</h3>
                    <p className="text-sm text-gray-500 mt-1">Submitted tasks</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                            <FontAwesomeIcon icon={faFileAlt} className="text-xl" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Avg Grade</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.averageScore}%</h3>
                    <p className="text-sm text-gray-500 mt-1">Across all subjects</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <div className="relative">
                            <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 font-medium appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="submitted">Submitted</option>
                                <option value="graded">Graded</option>
                            </select>
                        </div>

                        <div className="relative">
                            <FontAwesomeIcon icon={faFileAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 font-medium appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                                value={filterSubject}
                                onChange={(e) => setFilterSubject(e.target.value)}
                            >
                                <option value="all">All Subjects</option>
                                {subjects.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="relative w-full md:w-64">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search assignments..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Assignments List */}
            <div className="space-y-4">
                {filteredAssignments.map((assignment) => (
                    <div key={assignment.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left Section: Status & Date */}
                            <div className="lg:w-48 flex flex-col justify-center items-start border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 lg:pr-6">
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border ${getStatusColor(assignment.status)}`}>
                                    {assignment.status}
                                </div>
                                <div className="flex items-center text-gray-500 text-sm mb-1">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                    Due: {assignment.dueDate}
                                </div>
                                <div className={`text-sm font-medium flex items-center ${getPriorityColor(assignment.priority)}`}>
                                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                                    {assignment.timeLeft}
                                </div>
                            </div>

                            {/* Middle Section: Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                            {assignment.title}
                                        </h3>
                                        <p className="text-sm text-blue-500 font-medium mb-2">{assignment.subject} • {assignment.teacher}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-gray-500">Points</span>
                                        <p className="text-lg font-bold text-gray-800">
                                            {assignment.grade ? <span className="text-green-600">{assignment.grade}</span> : '-'}/{assignment.points}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assignment.description}</p>

                                {assignment.feedback && (
                                    <div className="bg-green-50 rounded-xl p-3 text-sm text-green-800 border border-green-100 flex items-start">
                                        <FontAwesomeIcon icon={faCommentAlt} className="mt-1 mr-2" />
                                        <div>
                                            <span className="font-bold">Feedback:</span> {assignment.feedback}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Section: Actions */}
                            <div className="lg:w-48 flex flex-col justify-center items-end gap-3 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                                {assignment.status === 'pending' || assignment.status === 'in-progress' ? (
                                    <>
                                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors flex items-center justify-center">
                                            <FontAwesomeIcon icon={faPen} className="mr-2" />
                                            {assignment.status === 'in-progress' ? 'Continue' : 'Start'}
                                        </button>
                                        <button className="w-full bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-600 hover:text-blue-600 font-semibold py-2 px-4 rounded-xl transition-all flex items-center justify-center">
                                            <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                                            Upload
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-xl transition-colors flex items-center justify-center">
                                            <FontAwesomeIcon icon={faSearch} className="mr-2" />
                                            View Details
                                        </button>
                                        {assignment.status === 'graded' && (
                                            <button className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center">
                                                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                                Download Graded
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredAssignments.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-2xl" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No assignments found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search query</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Assignments
