import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faSearch,
    faFilter,
    faEdit,
    faTrash,
    faDownload,
    faCheckCircle,
    faClock,
    faExclamationCircle,
    faUsers,
    faFileAlt,
    faCalendarAlt,
    faTimes
} from '@fortawesome/free-solid-svg-icons'

const TeacherAssignments = () => {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedClass, setSelectedClass] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Mock Data
    const classes = ['Class 9A', 'Class 9B', 'Class 10A']

    const [assignments, setAssignments] = useState([
        {
            id: 1,
            title: 'Algebra Problem Set 3',
            class: 'Class 9A',
            subject: 'Mathematics',
            dueDate: '2024-12-10',
            status: 'active',
            submissions: 28,
            totalStudents: 35,
            description: 'Complete problems 1-15 from Chapter 4. Show all work.',
            points: 100
        },
        {
            id: 2,
            title: 'Geometry Project',
            class: 'Class 9B',
            subject: 'Mathematics',
            dueDate: '2024-12-15',
            status: 'active',
            submissions: 12,
            totalStudents: 32,
            description: 'Create a model of a 3D geometric shape and calculate its volume and surface area.',
            points: 50
        },
        {
            id: 3,
            title: 'Trigonometry Quiz Prep',
            class: 'Class 10A',
            subject: 'Mathematics',
            dueDate: '2024-12-05',
            status: 'completed',
            submissions: 30,
            totalStudents: 30,
            description: 'Practice problems for the upcoming trigonometry quiz.',
            points: 20
        }
    ])

    const [newAssignment, setNewAssignment] = useState({
        title: '',
        class: '',
        subject: 'Mathematics',
        dueDate: '',
        points: '',
        description: ''
    })

    const handleCreateAssignment = (e) => {
        e.preventDefault()
        const assignment = {
            id: assignments.length + 1,
            ...newAssignment,
            status: 'active',
            submissions: 0,
            totalStudents: 30 // Mock total
        }
        setAssignments([assignment, ...assignments])
        setShowCreateModal(false)
        setNewAssignment({
            title: '',
            class: '',
            subject: 'Mathematics',
            dueDate: '',
            points: '',
            description: ''
        })
    }

    const filteredAssignments = assignments.filter(assignment => {
        const matchesClass = selectedClass === 'all' || assignment.class === selectedClass
        const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesClass && matchesSearch
    })

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-200'
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Assignments
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Create and manage assignments for your classes
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Create Assignment
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Active Assignments</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {assignments.filter(a => a.status === 'active').length}
                            </h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl text-green-600">
                            <FontAwesomeIcon icon={faFileAlt} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Pending Review</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {assignments.reduce((acc, curr) => acc + curr.submissions, 0)}
                            </h3>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
                            <FontAwesomeIcon icon={faClock} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Completion Rate</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {Math.round((assignments.reduce((acc, curr) => acc + curr.submissions, 0) / assignments.reduce((acc, curr) => acc + curr.totalStudents, 0)) * 100)}%
                            </h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
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
                            {/* Left Section: Status & Class */}
                            <div className="lg:w-48 flex flex-col justify-center items-start border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 lg:pr-6">
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border ${getStatusColor(assignment.status)}`}>
                                    {assignment.status}
                                </div>
                                <div className="flex items-center text-gray-600 font-semibold mb-1">
                                    <FontAwesomeIcon icon={faUsers} className="mr-2 text-blue-500" />
                                    {assignment.class}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                    Due: {assignment.dueDate}
                                </div>
                            </div>

                            {/* Middle Section: Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                        {assignment.title}
                                    </h3>
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-semibold">
                                        {assignment.points} Points
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assignment.description}</p>

                                <div className="flex items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Submission Progress</span>
                                            <span className="font-bold text-blue-600">
                                                {assignment.submissions}/{assignment.totalStudents}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                                style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section: Actions */}
                            <div className="lg:w-48 flex flex-col justify-center items-end gap-3 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                                <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2 px-4 rounded-xl transition-colors flex items-center justify-center">
                                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                    Edit
                                </button>
                                <button className="w-full bg-white border-2 border-gray-200 hover:border-red-500 text-gray-600 hover:text-red-600 font-semibold py-2 px-4 rounded-xl transition-all flex items-center justify-center">
                                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Assignment Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Create New Assignment</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAssignment} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="e.g., Algebra Quiz 1"
                                        value={newAssignment.title}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Class</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newAssignment.class}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, class: e.target.value })}
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map(cls => (
                                            <option key={cls} value={cls}>{cls}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newAssignment.dueDate}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Points</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="e.g., 100"
                                        value={newAssignment.points}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, points: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                    placeholder="Enter assignment details..."
                                    value={newAssignment.description}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    Create Assignment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherAssignments
