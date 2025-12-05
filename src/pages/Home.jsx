import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import AdmissionForm from '../components/AdmissionForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGraduationCap,
  faHeart
} from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebookF, faLinkedinIn, faInstagram }
  from "@fortawesome/free-brands-svg-icons";



const Home = () => {
  const [showLogin, setShowLogin] = useState(false)
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate(`/${user.role}`)
    }
  }, [user, loading, navigate])

  const handleLogin = () => {
    setShowLogin(true)
  }

  const handleLoginSuccess = (role) => {
    setShowLogin(false)
    navigate(`/${role}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Navigation onLogin={handleLogin} />
      <HeroSection />
      <FeaturesSection />
      <AdmissionForm />
      <Footer />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  )
}

const Navigation = ({ onLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
      ? 'bg-white/95 backdrop-blur-xl shadow-xl py-2'
      : 'bg-transparent py-4'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-green-400 to-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                EduManage Pro
              </h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                {['Home', 'Features', 'Admission', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onLogin}
              className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-700 group overflow-hidden"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-lg transition-colors duration-300"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-500 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="bg-white/95 backdrop-blur-lg mt-4 rounded-2xl mx-4 p-6 shadow-xl border border-white/20">
          <div className="space-y-4">
            {['Home', 'Features', 'Admission', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button
              onClick={() => {
                onLogin()
                setIsMenuOpen(false)
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg mt-4"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      const result = login(formData.email, formData.password, formData.role)
      if (result.success) {
        onLoginSuccess(formData.role)
      }
      setLoading(false)
    }, 1000)
  }

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      student: { email: 'student@demo.com', password: 'student123' },
      teacher: { email: 'teacher@demo.com', password: 'teacher123' },
      admin: { email: 'admin@demo.com', password: 'admin123' }
    }

    const credentials = demoCredentials[role]
    setFormData({ ...credentials, role })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-6 animate-slide-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300 p-2 hover:bg-gray-100 rounded-full"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                placeholder="Enter your email"
                required
              />
              <i className="fas fa-envelope absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                placeholder="Enter your password"
                required
              />
              <i className="fas fa-lock absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Login As</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-3 text-center">Try demo accounts:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('student')}
              className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 border border-blue-200"
            >
              <i className="fas fa-user-graduate mr-1"></i> Student
            </button>
            <button
              onClick={() => handleDemoLogin('teacher')}
              className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 border border-purple-200"
            >
              <i className="fas fa-chalkboard-teacher mr-1"></i> Teacher
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 border border-green-200"
            >
              <i className="fas fa-user-shield mr-1"></i> Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Footer = () => {

  const socialIcons = {
    twitter: faTwitter,
    facebook: faFacebookF,
    linkedin: faLinkedinIn,
    instagram: faInstagram
  }

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h3 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
          EduManage Pro
        </h3>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Empowering education through cutting-edge technology and innovative solutions
        </p>

        <div className="flex justify-center space-x-6 mb-6">
          {Object.entries(socialIcons).map(([platform, icon]) => (
            <a
              key={platform}
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-blue-500 hover:scale-110"
            >
              <FontAwesomeIcon icon={icon} />
            </a>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-6 text-gray-400 text-sm">
          {['About', 'Features', 'Pricing', 'Contact', 'Privacy', 'Terms'].map((item) => (
            <a key={item} href="#" className="hover:text-white transition-colors duration-300">
              {item}
            </a>
          ))}
        </div>

        <p className="text-gray-500 text-sm">
          © 2024 EduManage Pro. All rights reserved. Crafted with <FontAwesomeIcon icon={faHeart} className="text-red-400 mx-1" /> for education
        </p>
      </div>
    </footer>
  )
}

export default Home