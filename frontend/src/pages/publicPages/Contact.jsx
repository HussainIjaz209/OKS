import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
  faPaperPlane,
  faCheckCircle,
  faExclamationCircle,
  faSchool,
  faUserGraduate,
  faComments,
  faGlobeAsia,
} from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faTwitter, faInstagram, faYoutube, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import PublicLayout from '../../components/PublicLayout'
import LoginModal from '../../components/LoginModal'
import { useNavigate } from 'react-router-dom'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentClass: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const navigate = useNavigate()

  const contactInfo = [
    {
      icon: faMapMarkerAlt,
      title: 'School Address',
      details: [
        'The Ocean of Knowledge School System',
        'Main Road, Kot Charbagh',
        'Swat, Khyber Pakhtunkhwa',
        'Pakistan'
      ],
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: faPhone,
      title: 'Contact Numbers',
      details: [
        'Principal Office: +92 123 4567890',
        'Admissions: +92 123 4567891',
        'Accounts Office: +92 123 4567892',
        'Emergency: +92 300 1234567'
      ],
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: faEnvelope,
      title: 'Email Addresses',
      details: [
        'Principal: principal@okss.edu.pk',
        'Admissions: admissions@okss.edu.pk',
        'General Info: info@okss.edu.pk',
        'Accounts: accounts@okss.edu.pk'
      ],
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: faClock,
      title: 'School Timings',
      details: [
        'Monday - Friday: 8:00 AM - 2:00 PM',
        'Saturday: 8:00 AM - 12:00 PM',
        'Office Hours: 8:00 AM - 4:00 PM',
        'Closed on Sundays & Public Holidays'
      ],
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600'
    }
  ]

  const socialMedia = [
    { icon: faFacebook, name: 'Facebook', url: '#', color: 'bg-blue-600', text: 'text-white' },
    { icon: faTwitter, name: 'Twitter', url: '#', color: 'bg-sky-500', text: 'text-white' },
    { icon: faInstagram, name: 'Instagram', url: '#', color: 'bg-pink-600', text: 'text-white' },
    { icon: faYoutube, name: 'YouTube', url: '#', color: 'bg-red-600', text: 'text-white' },
    { icon: faWhatsapp, name: 'WhatsApp', url: '#', color: 'bg-green-500', text: 'text-white' }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        studentClass: '',
        subject: '',
        message: ''
      })

      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000)
    }, 1500)
  }

  const handleLoginSuccess = (role) => {
    setShowLogin(false)
    navigate(`/${role}`)
  }

  return (
    <>
      <PublicLayout onLogin={() => setShowLogin(true)}>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
          {/* Hero Section */}
          <div className="relative py-16 px-4 bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '200px'
              }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Get in <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">Touch</span>
                </h1>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
                  We're here to help! Reach out to us for admissions, inquiries, or to learn more about The Ocean of Knowledge School System.
                </p>

                {/* Quick Contact Stats */}
                <div className="flex flex-wrap justify-center gap-8 mt-12">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">24h</div>
                    <div className="text-blue-100">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">100%</div>
                    <div className="text-blue-100">Admission Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">7 Days</div>
                    <div className="text-blue-100">Office Open</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">1000+</div>
                    <div className="text-blue-100">Parents Connected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Contact Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="text-2xl text-white"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <ul className="space-y-3">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Left Column - Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={faComments} className="text-xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Send Us a Message</h2>
                      <p className="text-gray-600">We'll get back to you within 24 hours</p>
                    </div>
                  </div>

                  {submitStatus === 'success' && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl mr-3" />
                      <div>
                        <h4 className="font-bold text-green-800">Message Sent Successfully!</h4>
                        <p className="text-green-600 text-sm">Thank you for contacting us. We'll respond to your query soon.</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <FontAwesomeIcon
                            icon={faUserGraduate}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <FontAwesomeIcon
                            icon={faPhone}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+92 300 1234567"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Student's Class
                        </label>
                        <div className="relative">
                          <FontAwesomeIcon
                            icon={faSchool}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                          />
                          <select
                            name="studentClass"
                            value={formData.studentClass}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                          >
                            <option value="">Select Class</option>
                            <option value="Playgroup">Playgroup</option>
                            <option value="Nursery">Nursery</option>
                            <option value="Prep">Prep</option>
                            <option value="1st">1st Grade</option>
                            <option value="2nd">2nd Grade</option>
                            <option value="3rd">3rd Grade</option>
                            <option value="4th">4th Grade</option>
                            <option value="5th">5th Grade</option>
                            <option value="6th">6th Grade</option>
                            <option value="7th">7th Grade</option>
                            <option value="8th">8th Grade</option>
                            <option value="9th">9th Grade</option>
                            <option value="10th">10th Grade</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Subject *
                      </label>
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faPaperPlane}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="What is this regarding?"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        placeholder="Please write your message here..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    <div className="flex items-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex items-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                          }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faPaperPlane} className="mr-3" />
                            Send Message
                          </>
                        )}
                      </button>
                      <div className="ml-6 text-gray-600 text-sm">
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                        All fields marked with * are required
                      </div>
                    </div>
                  </form>
                </div>

                {/* Map Section */}
                <div className="mt-12 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={faGlobeAsia} className="text-xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Find Our Location</h2>
                      <p className="text-gray-600">Visit us at our campus in Kot Charbagh, Swat</p>
                    </div>
                  </div>

                  <div className="rounded-2xl overflow-hidden h-96 border border-gray-200">
                    {/* This would be your actual map component */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-3xl text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">The Ocean of Knowledge School System</h3>
                        <p className="text-gray-700 mb-6">Main Road, Kot Charbagh, Swat, Pakistan</p>
                        <iframe 
                          src="https://www.google.com/maps/embed?pb=!1m24!1m12!1m3!1d235.92245697959123!2d72.43096191153103!3d34.813929602428594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m9!3e2!4m3!3m2!1d34.8140208!2d72.4308865!4m3!3m2!1d34.8139105!2d72.4310418!5e1!3m2!1sen!2s!4v1765476231675!5m2!1sen!2s" 
                          width="800" 
                          height="650" 
                          style={{ border: 0 }} 
                          allowFullScreen="" 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Ocean of Knowledge School System Location"
                        ></iframe>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2">By Road</h4>
                      <p className="text-gray-700 text-sm">Located on Main Road, Kot Charbagh, easily accessible via public and private transport.</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Parking</h4>
                      <p className="text-gray-700 text-sm">Ample parking space available for parents and visitors at the campus.</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Landmark</h4>
                      <p className="text-gray-700 text-sm">Opposite Community Health Center, near Kot Charbagh Bazaar.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-8">
                {/* Quick Inquiry */}
                <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-3xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6">Quick Inquiry</h3>
                  <div className="space-y-4">
                    <a
                      href="tel:+921234567890"
                      className="flex items-center bg-white/20 hover:bg-white/30 p-4 rounded-xl transition-colors"
                    >
                      <FontAwesomeIcon icon={faPhone} className="mr-4 text-xl" />
                      <div>
                        <div className="font-semibold">Call for Admissions</div>
                        <div className="text-blue-100">+92 123 4567890</div>
                      </div>
                    </a>
                    <a
                      href="mailto:admissions@okss.edu.pk"
                      className="flex items-center bg-white/20 hover:bg-white/30 p-4 rounded-xl transition-colors"
                    >
                      <FontAwesomeIcon icon={faEnvelope} className="mr-4 text-xl" />
                      <div>
                        <div className="font-semibold">Email for Info</div>
                        <div className="text-blue-100">admissions@okss.edu.pk</div>
                      </div>
                    </a>
                    <a
                      href="https://wa.me/923001234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-white/20 hover:bg-white/30 p-4 rounded-xl transition-colors"
                    >
                      <FontAwesomeIcon icon={faWhatsapp} className="mr-4 text-xl" />
                      <div>
                        <div className="font-semibold">WhatsApp</div>
                        <div className="text-blue-100">+92 300 1234567</div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h3>
                  <div className="space-y-4">
                    {socialMedia.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all hover:scale-[1.02]"
                      >
                        <div className={`w-12 h-12 rounded-xl ${social.color} flex items-center justify-center mr-4`}>
                          <FontAwesomeIcon icon={social.icon} className={`text-xl ${social.text}`} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{social.name}</div>
                          <div className="text-gray-600 text-sm">Latest updates and news</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Office Hours */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Office Hours</h3>
                  <div className="space-y-4">
                    {[
                      { day: 'Monday - Friday', time: '8:00 AM - 4:00 PM', highlight: true },
                      { day: 'Saturday', time: '8:00 AM - 1:00 PM', highlight: false },
                      { day: 'Sunday', time: 'Closed', highlight: false },
                      { day: 'Public Holidays', time: 'Closed', highlight: false }
                    ].map((schedule, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-between items-center p-3 rounded-lg ${schedule.highlight ? 'bg-blue-50' : 'bg-gray-50'
                          }`}
                      >
                        <span className="font-medium text-gray-900">{schedule.day}</span>
                        <span className={`font-semibold ${schedule.highlight ? 'text-blue-600' : 'text-gray-700'
                          }`}>{schedule.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Emergency Contact</h3>
                  <p className="mb-6 text-red-100">For urgent matters outside office hours</p>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">+92 300 1234567</div>
                    <div className="text-red-100">Available 24/7 for emergencies</div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Quick answers to common questions about admissions, fees, and school policies.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    q: "What are the admission requirements?",
                    a: "Admission requires previous school records, birth certificate, and parent's CNIC. An assessment test may be conducted for certain grades."
                  },
                  {
                    q: "What is the fee structure?",
                    a: "Fee structure varies by grade level. Please contact our accounts office at accounts@okss.edu.pk for detailed fee information."
                  },
                  {
                    q: "Does the school provide transportation?",
                    a: "Yes, we have a safe and reliable school transport service covering major routes in Kot Charbagh and surrounding areas."
                  },
                  {
                    q: "What is the teacher-to-student ratio?",
                    a: "We maintain a 1:25 teacher-to-student ratio to ensure personalized attention and quality education for every child."
                  },
                  {
                    q: "Are scholarships available?",
                    a: "Yes, we offer merit-based scholarships for exceptional students. Please inquire at the principal's office for details."
                  },
                  {
                    q: "What co-curricular activities are offered?",
                    a: "We offer sports, arts, Quran classes, debates, science clubs, and cultural activities as part of our holistic education approach."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                        Q{index + 1}
                      </div>
                      {faq.q}
                    </h4>
                    <p className="text-gray-700 pl-11">{faq.a}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-gray-600">
                  Have more questions? <a href="tel:+921234567890" className="text-blue-600 font-semibold hover:underline">Call us directly</a> or <a href="mailto:info@okss.edu.pk" className="text-blue-600 font-semibold hover:underline">send us an email</a>.
                </p>
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