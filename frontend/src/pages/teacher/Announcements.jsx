import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faSearch,
    faFilter,
    faBullhorn,
    faEdit,
    faTrash,
    faTimes,
    faBell,
    faExclamationCircle,
    faInfoCircle,
    faCheckCircle,
    faUsers,
    faCalendarAlt,
    faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext'

const TeacherAnnouncements = () => {
    const { user } = useAuth()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [filterPriority, setFilterPriority] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [announcements, setAnnouncements] = useState([])
    const [managedClasses, setManagedClasses] = useState([])
    const [loading, setLoading] = useState(true)

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        message: '',
        audience: 'all',
        className: '',
        section: '',
        priority: 'medium'
    })

    const fetchAnnouncements = async () => {
        if (!user?.teacherId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/announcements/teacher/${user.teacherId}`);
            if (!response.ok) throw new Error('Failed to fetch announcements');
            const data = await response.json();
            setAnnouncements(data);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }

    const fetchManagedClasses = async () => {
        if (!user?.teacherId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/teachers/managed-classes/${user.teacherId}`);
            if (!response.ok) throw new Error('Failed to fetch classes');
            const data = await response.json();
            setManagedClasses(data);
        } catch (err) {
            console.error('Error:', err);
        }
    }

    useEffect(() => {
        fetchAnnouncements();
        fetchManagedClasses();
    }, [user]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const announcementData = {
                title: newAnnouncement.title,
                content: newAnnouncement.message, // Map message to content
                audience: newAnnouncement.audience === 'all' ? 'all' : 'class',
                priority: newAnnouncement.priority,
                className: newAnnouncement.audience !== 'all' ? newAnnouncement.audience.split('|')[0] : '',
                section: newAnnouncement.audience !== 'all' ? newAnnouncement.audience.split('|')[1] : '',
                teacherId: user.teacherId,
                authorName: user.name,
                sender: user._id
            };

            const response = await fetch(`${API_BASE_URL}/api/announcements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(announcementData)
            });

            if (response.ok) {
                fetchAnnouncements();
                setShowCreateModal(false);
                setNewAnnouncement({
                    title: '',
                    message: '',
                    audience: 'all',
                    className: '',
                    section: '',
                    priority: 'medium'
                });
            }
        } catch (err) {
            console.error('Error creating announcement:', err);
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/announcements/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setAnnouncements(announcements.filter(a => a._id !== id));
            }
        } catch (err) {
            console.error('Error deleting announcement:', err);
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200'
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            case 'low': return 'bg-green-100 text-green-700 border-green-200'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high': return faExclamationCircle
            case 'medium': return faInfoCircle
            case 'low': return faCheckCircle
            default: return faBell
        }
    }

    const filteredAnnouncements = announcements.filter(announcement => {
        const matchesPriority = filterPriority === 'all' || announcement.priority === filterPriority
        const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesPriority && matchesSearch
    })

    const highPriorityCount = announcements.filter(a => a.priority === 'high').length;
    const thisMonthCount = announcements.filter(a => {
        const date = new Date(a.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Announcements
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Share important updates with your students
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Post Announcement
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Posts</p>
                            <h3 className="text-3xl font-bold text-gray-800">{announcements.length}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            <FontAwesomeIcon icon={faBullhorn} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">High Priority</p>
                            <h3 className="text-3xl font-bold text-gray-800">{highPriorityCount}</h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-xl text-red-600">
                            <FontAwesomeIcon icon={faExclamationCircle} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">This Month</p>
                            <h3 className="text-3xl font-bold text-gray-800">{thisMonthCount}</h3>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-xl" />
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
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                            >
                                <option value="all">All Priorities</option>
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>
                        </div>
                    </div>

                    <div className="relative w-full md:w-64">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search announcements..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-lg">
                        <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-500 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Loading announcements...</p>
                    </div>
                ) : filteredAnnouncements.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-lg">
                        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 text-4xl">
                            <FontAwesomeIcon icon={faBullhorn} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No announcements found</h3>
                        <p className="text-gray-500 mb-6">Post your first announcement to share updates with your students.</p>
                    </div>
                ) : (
                    filteredAnnouncements.map((announcement) => (
                        <div key={announcement._id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center ${getPriorityColor(announcement.priority)}`}>
                                            <FontAwesomeIcon icon={getPriorityIcon(announcement.priority)} className="mr-2" />
                                            {announcement.priority}
                                        </span>
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                            {new Date(announcement.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <FontAwesomeIcon icon={faUsers} className="mr-2" />
                                            {announcement.audience === 'all' ? 'All Classes' : `${announcement.className} ${announcement.section}`}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                        {announcement.title}
                                    </h3>

                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {announcement.content}
                                    </p>
                                </div>

                                <div className="flex md:flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                    <button
                                        onClick={() => handleDelete(announcement._id)}
                                        className="flex-1 md:flex-none bg-red-50 hover:bg-red-100 text-red-500 p-3 rounded-xl transition-colors"
                                        title="Delete"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Post Announcement</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="e.g., Exam Schedule Update"
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Audience</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newAnnouncement.audience}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, audience: e.target.value })}
                                    >
                                        <option value="all">All Classes</option>
                                        {managedClasses.map(cls => (
                                            <option key={cls._id} value={`${cls.name}|${cls.section}`}>
                                                Class {cls.name} {cls.section}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newAnnouncement.priority}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                <textarea
                                    required
                                    rows="5"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                    placeholder="Type your announcement here..."
                                    value={newAnnouncement.message}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
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
                                    Post Announcement
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherAnnouncements
