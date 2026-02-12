import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faCalendarAlt,
  faUsers,
  faStar,
  faFilter,
  faImages,
  faPlay,
} from '@fortawesome/free-solid-svg-icons'
import PublicLayout from '../../components/PublicLayout'
import LoginModal from '../../components/LoginModal'
import { useNavigate, NavLink } from 'react-router-dom'
import { API_BASE_URL } from '../../apiConfig'

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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

  // Gallery categories and images
  const categories = [
    { id: 'all', name: 'All Events', count: events.length, icon: faImages },
    { id: 'Cultural', name: 'Cultural Events', count: events.filter(e => e.category === 'Cultural').length, icon: faUsers },
    { id: 'Academic', name: 'Academic Achievements', count: events.filter(e => e.category === 'Academic').length, icon: faStar },
    { id: 'Sports', name: 'Sports Day', count: events.filter(e => e.category === 'Sports').length, icon: faPlay },
    { id: 'General', name: 'Special Days', count: events.filter(e => e.category === 'General').length, icon: faCalendarAlt }
  ]

  // Map API events to gallery format
  const allEvents = events.map(event => ({
    id: event._id,
    title: event.title,
    description: event.description,
    category: event.category,
    date: new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    image: event.images && event.images.length > 0 ? `${API_BASE_URL}/${event.images[0]}` : null,
    gallery: [
      ...(event.images || []).map((img) => ({
        type: 'image',
        src: `${API_BASE_URL}/${img}`,
        description: event.description || event.title
      })),
      ...(event.videos || []).map((vid) => ({
        type: 'video',
        src: vid,
        description: event.description || event.title
      }))
    ]
  }));

  // Filter events instead of individual images
  const filteredEvents = allEvents.filter(event => {
    const matchesCategory = selectedCategory === 'all' ||
      event.category === selectedCategory ||
      event.category?.toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch = searchTerm === '' ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Removed openLightbox - no longer needed since we navigate to event details

  // Removed closeLightbox and navigateImage - no longer needed

  const handleLoginSuccess = (role) => {
    setShowLogin(false)
    navigate(`/${role}`)
  }

  return (
    <>
      <PublicLayout onLogin={() => setShowLogin(true)}>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
          {/* Hero Header */}
          <div className="relative py-16 px-4 bg-gradient-to-r from-blue-600 to-teal-600 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '200px'
              }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  School <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">Gallery</span>
                </h1>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
                  Capturing precious moments, achievements, and celebrations at The Ocean of Knowledge School
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for events, activities, or specific moments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-blue-100 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 text-lg"
                    />
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-xl"
                    />
                  </div>
                  <p className="text-blue-100 text-sm mt-3">
                    Browse through {events.length}+ events from our school life
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Categories Filter */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FontAwesomeIcon icon={faFilter} className="mr-3 text-blue-600" />
                  Filter by Category
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Showing:</span>
                  <span className="font-bold text-blue-600">{filteredEvents.length} events</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:shadow-md'
                      }`}
                  >
                    <FontAwesomeIcon
                      icon={category.icon}
                      className={`mr-3 ${selectedCategory === category.id ? 'text-white' : 'text-blue-500'}`}
                    />
                    <span className="font-semibold">{category.name}</span>
                    <span className={`ml-3 px-2 py-1 rounded-full text-sm ${selectedCategory === category.id
                      ? 'bg-white/30'
                      : 'bg-blue-100 text-blue-700'
                      }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="mb-16">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faSearch} className="text-5xl text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">No events found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={event.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'}
                          alt={event.title}
                          className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Image count badge */}
                        {event.gallery && event.gallery.length > 1 && (
                          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                            <FontAwesomeIcon icon={faImages} />
                            {event.gallery.length}
                          </div>
                        )}

                        {/* Image Overlay Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <div className="bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-2xl">
                            <h3 className="text-white font-bold text-lg mb-2">{event.title}</h3>
                            <p className="text-gray-200 text-sm mb-3 line-clamp-2">{event.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-yellow-300 text-sm font-semibold">
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                {event.date}
                              </span>
                              <NavLink
                                to={`/events/${event.id}`}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                              >
                                View Details
                              </NavLink>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-gray-900">{event.title}</h3>
                          <span className="text-sm text-white px-3 py-1 rounded-full bg-blue-500">
                            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center text-gray-500 text-sm">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                            {event.date}
                          </div>
                          {event.gallery && event.gallery.length > 0 && (
                            <div className="flex items-center text-blue-600 text-sm font-semibold">
                              <FontAwesomeIcon icon={faImages} className="mr-1" />
                              {event.gallery.length} {event.gallery.length === 1 ? 'photo' : 'photos'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-8 mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{events.reduce((sum, e) => sum + (e.gallery?.length || 0), 0)}+</div>
                  <div className="text-blue-100">Photos Captured</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{events.length}+</div>
                  <div className="text-blue-100">Events Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">2018</div>
                  <div className="text-blue-100">Since Establishment</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">100%</div>
                  <div className="text-blue-100">Parent Satisfaction</div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </PublicLayout>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  )
}