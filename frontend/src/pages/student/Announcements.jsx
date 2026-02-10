import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBullhorn,
    faSearch,
    faFilter,
    faBell,
    faExclamationCircle,
    faInfoCircle,
    faCheckCircle,
    faCalendarAlt,
    faSpinner,
    faUserCircle
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext'

const StudentAnnouncements = () => {
    const { user } = useAuth()
    const [filterPriority, setFilterPriority] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchAnnouncements = async () => {
        try {
            const studentId = user?.studentId || user?.id || user?._id;
            if (!studentId) return;

            // 1. Get profile for class info
            const profileRes = await fetch(`${API_BASE_URL}/api/students/profile/${studentId}`);
            if (!profileRes.ok) throw new Error('Failed to fetch profile');
            const profileData = await profileRes.json();

            const className = profileData.class;
            const section = profileData.section;

            // 2. Fetch announcements
            const response = await fetch(`${API_BASE_URL}/api/announcements/student?className=${encodeURIComponent(className)}&section=${encodeURIComponent(section)}`);
            if (!response.ok) throw new Error('Failed to fetch announcements');
            const data = await response.json();
            setAnnouncements(data);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            fetchAnnouncements();
        }
    }, [user]);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-4 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg">
                        <FontAwesomeIcon icon={faBullhorn} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Announcements
                        </h1>
                        <p className="text-gray-600">Keep up with the latest updates from your teachers</p>
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
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No announcements yet</h3>
                        <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
                    </div>
                ) : (
                    filteredAnnouncements.map((announcement) => (
                        <div key={announcement._id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group border-l-4 border-l-blue-500">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center ${getPriorityColor(announcement.priority)}`}>
                                            <FontAwesomeIcon icon={getPriorityIcon(announcement.priority)} className="mr-2" />
                                            {announcement.priority}
                                        </span>
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                            {new Date(announcement.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                        <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                                            <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                                            {announcement.authorName || 'Teacher'}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                                        {announcement.title}
                                    </h3>

                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                                            {announcement.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default StudentAnnouncements
