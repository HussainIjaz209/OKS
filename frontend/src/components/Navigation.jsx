import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

const Navigation = ({ onLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className={`fixed top-0 w-full z-50 p-3 transition-all duration-500 bg-white/95 backdrop-blur-xl shadow-xl`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-green-400 to-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                OKS
              </h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8 ">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `relative font-medium transition-all duration-300 group ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`
                  }
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
                <NavLink
                  to="/gallery"
                  className={({ isActive }) =>
                    `relative font-medium transition-all duration-300 group ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`
                  }
                >
                  Gallery
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
                <NavLink
                  to="/online-admission"
                  className={({ isActive }) =>
                    `relative font-medium transition-all duration-300 group ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`
                  }
                >
                  Online Admission
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `relative font-medium transition-all duration-300 group ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`
                  }
                >
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
                <NavLink
                  to="/jobs"
                  className={({ isActive }) =>
                    `relative font-medium transition-all duration-300 group ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`
                  }
                >
                  Jobs
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
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
              className="text-black cursor-pointer hover:text-blue-600 p-2 rounded-lg transition-colors duration-300"
            >
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className='2xl' />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-500 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="bg-white/95 backdrop-blur-lg mt-4 rounded-2xl mx-4 p-6 shadow-xl border border-white/20">
          <div className="space-y-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 transition-colors duration-300 font-medium ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `block py-2 transition-colors duration-300 font-medium ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </NavLink>
            <NavLink
              to="/online-admission"
              className={({ isActive }) =>
                `block py-2 transition-colors duration-300 font-medium ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Online Admission
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `block py-2 transition-colors duration-300 font-medium ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `block py-2 transition-colors duration-300 font-medium ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Jobs
            </NavLink>
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

export default Navigation