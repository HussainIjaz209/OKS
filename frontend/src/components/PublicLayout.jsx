import React from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const PublicLayout = ({ children, onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Navigation onLogin={onLogin} />
      <main className="pt-16"> {/* Added padding-top for fixed nav */}
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout