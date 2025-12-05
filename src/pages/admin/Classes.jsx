import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faSearch,
    faSchool,
    faChalkboardTeacher,
    faUserGraduate,
    faEdit,
    faTrash,
    faEllipsisV,
    faTimes,
    faBook,
    faUsers
} from '@fortawesome/free-solid-svg-icons'

const AdminClasses = () => {
    const [showModal, setShowModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Mock Data
    const [classes, setClasses] = useState([
        {
            id: 1,
            name: 'Class 10',
            section: 'A',
            classTeacher: 'Mr. John Smith',
            students: 35,
            subjects: 6,
            room: 'Room 101'
        },
        {
            id: 2,
            name: 'Class 10',
            section: 'B',
            classTeacher: 'Mrs. Sarah Davis',
            students: 32,
            subjects: 6,
            room: 'Room 102'
        },
        {
            id: 3,
            name: 'Class 9',
            section: 'A',
            classTeacher: 'Mr. Robert Wilson',
            students: 30,
            subjects: 5,
            room: 'Room 201'
        },
        {
            id: 4,
            name: 'Class 9',
            section: 'B',
            classTeacher: 'Ms. Emily Taylor',
            students: 28,
            subjects: 5,
            room: 'Room 202'
        }
    ])

    const [newClass, setNewClass] = useState({
        name: '',
        section: '',
        classTeacher: '',
        room: '',
        capacity: ''
    })

    const handleCreateClass = (e) => {
        e.preventDefault()
        const classData = {
            id: classes.length + 1,
            ...newClass,
            students: 0,
            subjects: 0
        }
        setClasses([classData, ...classes])
        setShowModal(false)
        setNewClass({
            name: '',
            section: '',
            classTeacher: '',
            room: '',
            capacity: ''
        })
    }

    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.classTeacher.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Class Management
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Manage classes, sections, and teacher assignments
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Class
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Classes</p>
                            <h3 className="text-3xl font-bold text-gray-800">{classes.length}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            <FontAwesomeIcon icon={faSchool} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Students</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {classes.reduce((acc, curr) => acc + curr.students, 0)}
                            </h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl text-green-600">
                            <FontAwesomeIcon icon={faUserGraduate} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Avg Class Size</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {Math.round(classes.reduce((acc, curr) => acc + curr.students, 0) / classes.length)}
                            </h3>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                            <FontAwesomeIcon icon={faUsers} className="text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="relative w-full md:w-96">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search classes or teachers..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((cls) => (
                    <div key={cls.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group relative">
                        <div className="absolute top-4 right-4">
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </button>
                        </div>

                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold mr-4 group-hover:scale-110 transition-transform duration-300">
                                {cls.section}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{cls.name}</h3>
                                <p className="text-gray-500 text-sm">{cls.room}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center">
                                    <FontAwesomeIcon icon={faChalkboardTeacher} className="w-5 mr-2 text-gray-400" />
                                    Class Teacher
                                </span>
                                <span className="font-semibold text-gray-700">{cls.classTeacher}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center">
                                    <FontAwesomeIcon icon={faUserGraduate} className="w-5 mr-2 text-gray-400" />
                                    Students
                                </span>
                                <span className="font-semibold text-gray-700">{cls.students}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center">
                                    <FontAwesomeIcon icon={faBook} className="w-5 mr-2 text-gray-400" />
                                    Subjects
                                </span>
                                <span className="font-semibold text-gray-700">{cls.subjects}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex gap-3">
                            <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-xl font-medium transition-colors text-sm flex items-center justify-center">
                                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                Edit
                            </button>
                            <button className="w-10 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors">
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Class Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Add New Class</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateClass} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Class Name</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newClass.name}
                                        onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option value="Class 8">Class 8</option>
                                        <option value="Class 9">Class 9</option>
                                        <option value="Class 10">Class 10</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="e.g., A"
                                        value={newClass.section}
                                        onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Class Teacher</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Enter teacher name"
                                    value={newClass.classTeacher}
                                    onChange={(e) => setNewClass({ ...newClass, classTeacher: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Room Number</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="e.g., 101"
                                        value={newClass.room}
                                        onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="e.g., 40"
                                        value={newClass.capacity}
                                        onChange={(e) => setNewClass({ ...newClass, capacity: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    Create Class
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminClasses
