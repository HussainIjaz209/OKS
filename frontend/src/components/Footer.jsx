import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap, faHeart } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
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
          The Ocean of Knowledge School
        </h3>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Empowering education through cutting-edge technology and innovative solutions
        </p>

        <div className="flex justify-center space-x-6 mb-6">
            <a
              href="https://web.facebook.com/p/The-Ocean-of-Knowledge-School-System-100064714244067/"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-blue-500 hover:scale-110"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
        </div>

        <p className="text-gray-500 text-sm">
          © 2025 <a href="https://my-portfolio-b2iu.vercel.app/" className='text-blue-500'>Hussain Ijaz.</a> All rights reserved. Crafted with <FontAwesomeIcon icon={faHeart} className="text-red-400 mx-1" /> for education
        </p>
      </div>
    </footer>
  )
}

export default Footer