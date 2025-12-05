import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faSearch,
    faFilter,
    faUserGraduate,
    faCheckCircle,
    faTimesCircle,
    faClock,
    faFileAlt,
    faEllipsisV,
    faEnvelope,
    faPhone,
    faTimes,
    faSave
} from '@fortawesome/free-solid-svg-icons'

const AdminAdmissions = () => {
    const [showModal, setShowModal] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Mock Data
    const [applications, setApplications] = useState([
        {
            id: 1,
            studentName: 'John Smith',
            class: 'Class 9',
            parentName: 'Robert Smith',
            email: 'robert.s@email.com',
            phone: '+1 234 567 8901',
            date: '2024-12-05',
            status: 'pending',
            previousSchool: 'City High School',
            gpa: '3.8'
        },
        {
            id: 2,
            studentName: 'Alice Johnson',
            class: 'Class 10',
            parentName: 'Mary Johnson',
            email: 'mary.j@email.com',
            phone: '+1 234 567 8902',
            date: '2024-12-04',
            status: 'approved',
            previousSchool: 'Westside Academy',
            gpa: '4.0'
        },
        {
            id: 3,
            studentName: 'David Wilson',
            class: 'Class 8',
            parentName: 'James Wilson',
            email: 'james.w@email.com',
            phone: '+1 234 567 8903',
            date: '2024-12-03',
            status: 'rejected',
            previousSchool: 'North Hills School',
            gpa: '2.5'
        }
    ])

    const [newApplication, setNewApplication] = useState({
        studentName: '',
        class: '',
        parentName: '',
        email: '',
        phone: '',
        previousSchool: '',
        dob: '',
        address: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const application = {
            id: applications.length + 1,
            ...newApplication,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            gpa: 'N/A'
        }
        setApplications([application, ...applications])
        setShowModal(false)
        setNewApplication({
            studentName: '',
            class: '',
            parentName: '',
            email: '',
            phone: '',
            previousSchool: '',
            dob: '',
            address: ''
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200'
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200'
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const filteredApplications = applications.filter(app => {
        const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus
        const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.parentName.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Admissions
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Manage student enrollment and applications
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    New Admission
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Applications</p>
                            <h3 className="text-3xl font-bold text-gray-800">{applications.length}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            <FontAwesomeIcon icon={faFileAlt} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Pending Review</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {applications.filter(a => a.status === 'pending').length}
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
                            <p className="text-gray-500 text-sm font-medium">Approved</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {applications.filter(a => a.status === 'approved').length}
                            </h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl text-green-600">
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
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div className="relative w-full md:w-64">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Applicant</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Class</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Parent Details</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredApplications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                                {app.studentName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{app.studentName}</div>
                                                <div className="text-xs text-gray-500">{app.previousSchool}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                        {app.class}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 font-medium">{app.parentName}</div>
                                        <div className="text-xs text-gray-500 flex items-center mt-1">
                                            <FontAwesomeIcon icon={faPhone} className="mr-1" />
                                            {app.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {app.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                            <FontAwesomeIcon icon={faEllipsisV} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Admission Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center sticky top-0 z-10">
                            <h2 className="text-2xl font-bold text-white">New Admission</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.studentName}
                                        onChange={(e) => setNewApplication({ ...newApplication, studentName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.dob}
                                        onChange={(e) => setNewApplication({ ...newApplication, dob: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Class Applying For</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.class}
                                        onChange={(e) => setNewApplication({ ...newApplication, class: e.target.value })}
                                    >
                                        <option value="">Select Class</option>
                                        <option value="Class 8">Class 8</option>
                                        <option value="Class 9">Class 9</option>
                                        <option value="Class 10">Class 10</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Previous School</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.previousSchool}
                                        onChange={(e) => setNewApplication({ ...newApplication, previousSchool: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Parent Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.parentName}
                                        onChange={(e) => setNewApplication({ ...newApplication, parentName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.phone}
                                        onChange={(e) => setNewApplication({ ...newApplication, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={newApplication.email}
                                    onChange={(e) => setNewApplication({ ...newApplication, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                    value={newApplication.address}
                                    onChange={(e) => setNewApplication({ ...newApplication, address: e.target.value })}
                                ></textarea>
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
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminAdmissions
