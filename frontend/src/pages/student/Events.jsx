import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCalendarAlt,
    faMapMarkerAlt,
    faClock,
    faTrophy,
    faMusic,
    faFlask,
    faRunning,
    faPalette,
    faFilter,
    faSearch,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons'

const Events = () => {
    const navigate = useNavigate()
    const [activeCategory, setActiveCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/events?publishedOnly=true`);
                const data = await response.json();
                setEvents(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching events:', error);
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const categories = [
        { name: 'All', icon: faCalendarAlt },
        { name: 'Sports', icon: faRunning },
        { name: 'Academic', icon: faFlask },
        { name: 'Cultural', icon: faMusic },
        { name: 'Arts', icon: faPalette },
        { name: 'Competitions', icon: faTrophy }
    ]

    const featuredEvent = events.find(e => e.images && e.images.length > 0) || events[0] || {
        id: 1,
        title: 'Loading Events...',
        description: 'Please wait while we fetch the latest school activities.',
        image: 'from-blue-600 to-purple-600',
        date: '',
        time: '',
        location: ''
    }

    const filteredEvents = events.filter(event => {
        const matchesCategory = activeCategory === 'All' || event.category === activeCategory
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Sports': return 'text-green-600 bg-green-100'
            case 'Academic': return 'text-blue-600 bg-blue-100'
            case 'Cultural': return 'text-red-600 bg-red-100'
            case 'Arts': return 'text-orange-600 bg-orange-100'
            case 'Competitions': return 'text-purple-600 bg-purple-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    const getCardGradient = (color) => {
        switch (color) {
            case 'green': return 'from-green-500 to-emerald-600'
            case 'red': return 'from-red-500 to-rose-600'
            case 'orange': return 'from-orange-500 to-amber-600'
            case 'blue': return 'from-blue-500 to-indigo-600'
            case 'purple': return 'from-purple-500 to-violet-600'
            default: return 'from-gray-500 to-gray-600'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        School Events
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Discover and participate in upcoming activities
                    </p>
                </div>
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Featured Event */}
            <div className="mb-12">
                <div className={`rounded-3xl bg-gradient-to-r ${featuredEvent.image} p-8 text-white shadow-2xl relative overflow-hidden group`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40 z-0"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="max-w-2xl">
                            <div className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-bold mb-4 border border-white/30">
                                Featured Event
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">{featuredEvent.title}</h2>
                            <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                                {featuredEvent.description}
                            </p>
                            <div className="flex flex-wrap gap-6 text-sm font-medium">
                                <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                    {new Date(featuredEvent.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                                    {featuredEvent.time || 'All Day'}
                                </div>
                                <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                                    {featuredEvent.location}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            {featuredEvent.registered ? (
                                <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold shadow-lg cursor-default flex items-center justify-center">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                    Registered
                                </button>
                            ) : (
                                <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
                                    Register Now
                                </button>
                            )}
                            <button
                                onClick={() => navigate(`/student/events/${featuredEvent._id || featuredEvent.id}`)}
                                className="bg-white/10 text-white border border-white/30 px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all duration-300"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3 mb-8">
                {categories.map((cat) => (
                    <button
                        key={cat.name}
                        onClick={() => setActiveCategory(cat.name)}
                        className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${activeCategory === cat.name
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-50 hover:shadow-md'
                            }`}
                    >
                        <FontAwesomeIcon icon={cat.icon} />
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                    <div key={event.id || event._id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 group flex flex-col">
                        {event.images && event.images.length > 0 ? (
                            <div className="h-48 w-full overflow-hidden">
                                <img
                                    src={`${API_BASE_URL}/${event.images[0]}`}
                                    alt={event.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        ) : (
                            <div className={`h-3 bg-gradient-to-r ${getCardGradient(event.color)}`}></div>
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(event.category)}`}>
                                    {event.category}
                                </span>
                                <div className="text-center bg-gray-50 rounded-lg p-2 min-w-[60px]">
                                    <p className="text-xs text-gray-500 uppercase font-bold">{new Date(event.date).toLocaleString('default', { month: 'short' })}</p>
                                    <p className="text-xl font-bold text-gray-800">{new Date(event.date).getDate()}</p>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                {event.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-6 flex-1">
                                {event.description}
                            </p>

                            <div className="space-y-3 mb-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faClock} className="w-5 text-center mr-2 text-blue-500" />
                                    {event.time}
                                </div>
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 text-center mr-2 text-red-500" />
                                    {event.location}
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/student/events/${event._id || event.id}`)}
                                className="w-full bg-gray-50 text-gray-700 font-bold py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 flex items-center justify-center group-hover:shadow-md"
                            >
                                View Details
                                <FontAwesomeIcon icon={faChevronRight} className="ml-2 text-xs transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-3xl">
                        <FontAwesomeIcon icon={faFilter} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No events found</h3>
                    <p className="text-gray-500">Try adjusting your search or category filter</p>
                </div>
            )}
        </div>
    )
}

export default Events
