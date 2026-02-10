
import React, { useState, useEffect } from 'react'
import { useParams, Navigate, NavLink } from 'react-router-dom'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCalendarAlt,
    faChevronLeft,
    faChevronRight,
    faTimes,
    faPlay,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import PublicLayout from '../../components/PublicLayout'

const EventDetails = ({ isPublic = true }) => {
    const { id } = useParams()
    const [event, setEvent] = useState(null)
    const [selectedMedia, setSelectedMedia] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
                if (!response.ok) {
                    throw new Error('Event not found');
                }
                const foundEvent = await response.json();

                if (foundEvent) {
                    // Map API structure to UI structure if needed
                    const mappedEvent = {
                        ...foundEvent,
                        gradient: foundEvent.gradient || 'from-blue-600 to-purple-600',
                        image: foundEvent.images && foundEvent.images.length > 0
                            ? `${API_BASE_URL}/${foundEvent.images[0]}`
                            : (foundEvent.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'),
                        date: new Date(foundEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                        gallery: [
                            ...(foundEvent.images || []).map(img => ({ type: 'image', src: `${API_BASE_URL}/${img}`, description: foundEvent.title })),
                            ...(foundEvent.videos || []).map(vid => ({ type: 'video', src: vid, description: foundEvent.title }))
                        ]
                    };
                    setEvent(mappedEvent);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event:', error);
                setEvent(null);
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!event) {
        return <Navigate to="/gallery" replace />
    }

    const openLightbox = (media) => {
        setSelectedMedia(media)
        document.body.style.overflow = 'hidden'
    }

    const closeLightbox = () => {
        setSelectedMedia(null)
        document.body.style.overflow = 'auto'
    }

    const navigateMedia = (direction) => {
        if (!selectedMedia) return
        const currentIndex = event.gallery.findIndex(m => m.src === selectedMedia.src)
        let newIndex = currentIndex + direction
        if (newIndex < 0) newIndex = event.gallery.length - 1
        if (newIndex >= event.gallery.length) newIndex = 0
        setSelectedMedia(event.gallery[newIndex])
    }

    const content = (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className={`relative py-20 px-4 bg-gradient-to-br ${event.gradient} text-white overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <NavLink to={isPublic ? "/gallery" : "/student/events"} className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        {isPublic ? "Back to Gallery" : "Back to Events"}
                    </NavLink>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-1/3">
                            <img src={event.image} alt={event.title} className="w-full h-64 object-cover rounded-2xl shadow-2xl border-4 border-white/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500" />
                        </div>
                        <div className="w-full md:w-2/3">
                            <div className="flex items-center mb-4 text-blue-100">
                                <div className="bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm mr-4 text-sm font-bold">
                                    {event.category.toUpperCase()}
                                </div>
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                {event.date}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                {event.title}
                            </h1>
                            <p className="text-xl text-blue-50 leading-relaxed max-w-3xl">
                                {event.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Detailed Description */}
                <div className="bg-white rounded-3xl p-8 shadow-xl mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-blue-500 pl-4">About the Event</h2>
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                        {event.fullDescription || event.description}
                    </p>
                </div>

                {/* Gallery Grid */}
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Event Gallery</h2>
                {event.gallery.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {event.gallery.map((media, index) => (
                            <div
                                key={index}
                                onClick={() => openLightbox(media)}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-72"
                            >
                                {media.type === 'video' ? (
                                    <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                                        {/* Placeholder for video thumbnail if available, or just icon */}
                                        <FontAwesomeIcon icon={faPlay} className="text-5xl text-white/80 group-hover:text-white transition-colors" />
                                        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs font-bold uppercase">Video</div>
                                    </div>
                                ) : (
                                    <img
                                        src={media.src}
                                        alt={media.description}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <p className="text-white font-medium text-lg leading-snug line-clamp-2">
                                            {media.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 text-lg">No photos or videos available for this event yet.</p>
                )}
            </div>

            {/* Lightbox */}
            {selectedMedia && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
                    <button
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-4xl" />
                    </button>

                    <button
                        onClick={() => navigateMedia(-1)}
                        className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50 p-4"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="text-4xl" />
                    </button>

                    <button
                        onClick={() => navigateMedia(1)}
                        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50 p-4"
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="text-4xl" />
                    </button>

                    <div className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center px-4">
                        {selectedMedia.type === 'video' ? (
                            <video
                                src={selectedMedia.src}
                                controls
                                autoPlay
                                className="max-w-full max-h-[70vh] rounded-lg shadow-2xl"
                            />
                        ) : (
                            <img
                                src={selectedMedia.src}
                                alt={selectedMedia.description}
                                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                            />
                        )}

                        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-2xl text-center border border-white/10">
                            <p className="text-white text-lg font-medium">
                                {selectedMedia.description}
                            </p>
                            <div className="text-blue-200 text-sm mt-2 font-mono">
                                {event.gallery.findIndex(m => m.src === selectedMedia.src) + 1} / {event.gallery.length}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return isPublic ? <PublicLayout>{content}</PublicLayout> : content;
}

export default EventDetails
