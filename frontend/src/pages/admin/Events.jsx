import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faSearch,
    faCalendarAlt,
    faTrash,
    faEdit,
    faTimes,
    faMapMarkerAlt,
    faTag,
    faImage,
    faVideo,
    faCheckCircle,
    faEye
} from '@fortawesome/free-solid-svg-icons'

const AdminEvents = () => {
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentEvent, setCurrentEvent] = useState({
        title: '',
        description: '',
        date: '',
        location: 'School Campus',
        category: 'General',
        isPublished: true,
        images: [],
        videos: []
    })
    const [selectedImages, setSelectedImages] = useState([])

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/events`);
            const data = await response.json();
            setEvents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (event = null) => {
        if (event) {
            setIsEditing(true);
            setCurrentEvent({
                ...event,
                date: new Date(event.date).toISOString().split('T')[0]
            });
        } else {
            setIsEditing(false);
            setCurrentEvent({
                title: '',
                description: '',
                date: '',
                location: 'School Campus',
                category: 'General',
                isPublished: true,
                images: [],
                videos: []
            });
        }
        setSelectedImages([]);
        setShowModal(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isEditing
                ? `${API_BASE_URL}/api/events/${currentEvent._id}`
                : `${API_BASE_URL}/api/events`;
            const method = isEditing ? 'PUT' : 'POST';

            const formData = new FormData();
            formData.append('title', currentEvent.title);
            formData.append('description', currentEvent.description);
            formData.append('date', currentEvent.date);
            formData.append('location', currentEvent.location);
            formData.append('category', currentEvent.category);
            formData.append('isPublished', currentEvent.isPublished);

            if (selectedImages.length > 0) {
                selectedImages.forEach(image => {
                    formData.append('images', image);
                });
            }

            const response = await fetch(url, {
                method,
                body: formData
            });

            if (response.ok) {
                fetchData();
                setShowModal(false);
                setSelectedImages([]);
            } else {
                alert('Failed to save event');
            }
        } catch (error) {
            console.error('Error saving event:', error);
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/events/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    fetchData();
                }
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    }

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const categories = ['Sports', 'Academic', 'Cultural', 'Arts', 'Competitions', 'General'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Events Management
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Create and manage school events and activities
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Event
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="relative w-full md:w-96">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search events by title or category..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Events Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <div key={event._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col">
                            {event.images && event.images.length > 0 && (
                                <div className="h-48 w-full overflow-hidden">
                                    <img
                                        src={`${API_BASE_URL}/${event.images[0]}`}
                                        alt={event.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            )}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600`}>
                                        {event.category}
                                    </span>
                                    <div className="flex gap-2">
                                        {event.isPublished ? (
                                            <span className="text-green-500 text-xs flex items-center gap-1">
                                                <FontAwesomeIcon icon={faCheckCircle} /> Published
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs flex items-center gap-1">
                                                Draft
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                    {event.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                    {event.description}
                                </p>

                                <div className="space-y-3 mb-6 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="w-5 text-center mr-2 text-blue-500" />
                                        {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 text-center mr-2 text-red-500" />
                                        {event.location}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex gap-3">
                                    <button
                                        onClick={() => handleOpenModal(event)}
                                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-xl font-medium transition-colors text-sm flex items-center justify-center"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event._id)}
                                        className="w-10 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">
                                {isEditing ? 'Edit Event' : 'Add New Event'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition-colors">
                                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={currentEvent.title}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={currentEvent.date}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={currentEvent.category}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, category: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={currentEvent.location}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32"
                                        value={currentEvent.description}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Event Images (Max 10)</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => setSelectedImages(Array.from(e.target.files))}
                                            className="hidden"
                                            id="event-image-upload"
                                        />
                                        <label
                                            htmlFor="event-image-upload"
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl cursor-pointer hover:bg-blue-100 transition-all font-medium"
                                        >
                                            <FontAwesomeIcon icon={faImage} />
                                            {selectedImages.length > 0 ? `${selectedImages.length} image(s) selected` : 'Choose Images'}
                                        </label>
                                    </div>

                                    {/* Image Previews */}
                                    {selectedImages.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {selectedImages.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} className="text-xs" />
                                                    </button>
                                                    <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isEditing && currentEvent.images && currentEvent.images.length > 0 && selectedImages.length === 0 && (
                                        <p className="text-xs text-gray-500 mt-2 italic">Current images will be kept. Upload new images to add more.</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={currentEvent.isPublished}
                                            onChange={(e) => setCurrentEvent({ ...currentEvent, isPublished: e.target.checked })}
                                        />
                                        <span className="text-sm font-semibold text-gray-700">Publish immediately</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                                >
                                    {isEditing ? 'Update Event' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminEvents
