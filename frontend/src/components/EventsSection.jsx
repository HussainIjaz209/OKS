import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarAlt,
  faFlag,
  faUsers,
  faBookQuran,
  faTrophy,
  faFutbol,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'

// import { eventsData } from '../data/eventsData'
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../apiConfig'

const EventsSection = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events?publishedOnly=true`);
        const data = await response.json();
        // Merge with static data or just use API data
        // For now, let's use API data but fallback to static if empty
        if (data && data.length > 0) {
          setEvents(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getGradient = (category) => {
    switch (category) {
      case 'Sports': return 'from-green-500 to-emerald-600';
      case 'Academic': return 'from-blue-500 to-indigo-600';
      case 'Cultural': return 'from-purple-500 to-pink-600';
      case 'Arts': return 'from-orange-500 to-amber-600';
      case 'Competitions': return 'from-yellow-500 to-orange-600';
      default: return 'from-blue-600 to-purple-600';
    }
  }

  const getIcon = (category) => {
    switch (category) {
      case 'Sports': return faFutbol;
      case 'Academic': return faBookQuran;
      case 'Cultural': return faUsers;
      case 'Arts': return faFlag;
      case 'Competitions': return faTrophy;
      default: return faCalendarAlt;
    }
  }

  return (
    <section id="events" className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-teal-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-3 mb-6">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 mr-2" />
            <span className="text-blue-800 font-semibold">School Events & Activities</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            The Ocean of Knowledge School
            <span className="block text-3xl md:text-4xl lg:text-5xl text-blue-600 mt-2"> Events Gallery</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Celebrating achievements, cultural heritage, and special moments that make our school community vibrant and united.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => {
            const gradient = event.gradient || getGradient(event.category);
            const icon = event.icon || getIcon(event.category);
            const dateStr = event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : event.date;

            return (
              <div
                key={event._id || index}
                className="group relative bg-white rounded-3xl p-6 border border-gray-200 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] transform hover:border-blue-200"
              >
                {/* Event Image */}
                <div className="relative h-48 w-full mb-6 rounded-2xl overflow-hidden">
                  <img
                    src={event.images && event.images.length > 0 ? `${API_BASE_URL}/${event.images[0]}` : (event.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80')}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r ${gradient} rounded-2xl">
                          <span class="text-white font-bold text-center px-4">${event.title}</span>
                        </div>
                      `
                    }}
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${gradient} text-white text-sm font-semibold`}>
                    {dateStr}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="relative">
                  {/* Icon and Title */}
                  <div className="flex items-start mb-4">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <FontAwesomeIcon
                        icon={icon}
                        className="text-xl text-white"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-medium">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                        {dateStr}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {event.description}
                  </p>

                  {/* View More Button */}
                  <NavLink to={`/events/${event._id || event.id}`} className="flex items-center text-blue-600 font-semibold cursor-pointer group/btn">
                    <span className="mr-2 group-hover/btn:text-blue-800 transition-colors duration-300">View Details</span>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-sm transform group-hover/btn:translate-x-1 transition-transform duration-300"
                    />
                  </NavLink>
                </div>

              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NavLink to='/gallery' className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200 hover:scale-105 transform hover:from-blue-700 hover:to-blue-800">
              View All Events Gallery
            </NavLink>
            <button className="bg-white text-blue-600 border-2 border-blue-200 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:scale-105 transform">
              Upcoming Events
            </button>
          </div>

          <p className="text-gray-300 mt-8 max-w-2xl mx-auto">
            At Ocean of Knowledge School, we believe in holistic development through diverse activities that celebrate culture, achievement, and community spirit. Each event is carefully planned to enrich our students' learning experience.
          </p>

          {/* School Motto */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-300 mt-4 italic">
              Move forward with confidence, grow through knowledge, and shine in every aspect of life.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventsSection