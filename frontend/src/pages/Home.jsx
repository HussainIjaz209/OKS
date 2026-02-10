import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import HeroSection from '../components/HeroSection'
import About from '../components/About'
import EventsSection from '../components/EventsSection'
import Message from '../components/Message'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'

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
      <About />
      <EventsSection />
      <Message />
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

export default Home