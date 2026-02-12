import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteLeft, faSignature, faStar } from '@fortawesome/free-solid-svg-icons'

import logo from '../assets/logo.png'
import Director from '../assets/director/director.jpg'

export default function Message() {
  return (
    <div className="relative py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-teal-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px'
          }}></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-6">
            <FontAwesomeIcon icon={faStar} className="text-blue-600" />
            <span className="text-blue-800 font-semibold">A Message From</span>
            <FontAwesomeIcon icon={faStar} className="text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            The Director's 
            {/* <span className="block text-5xl md:text-6xl bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mt-2">
              Message
            </span> */}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Left Column - School Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-2">
                    <div className="text-center">
                      <img src={logo} alt="logo" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">The Ocean of Knowledge School</h3>
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
                  <span className="text-sm font-semibold text-blue-800">Kot Charbagh, Swat, Pakistan</span>
                </div>
              </div>

              {/* Motto Highlight */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-100 mb-6">
                <img src={Director} alt="Director" />
              </div>

              {/* Key Pillars */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Our Educational Pillars</h4>
                {['Character Building', 'Academic Excellence', 'Holistic Development', 'Community Values'].map((pillar, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index === 0 ? 'bg-blue-100 text-blue-600' :
                      index === 1 ? 'bg-teal-100 text-teal-600' :
                      index === 2 ? 'bg-purple-100 text-purple-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-800">{pillar}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Message Content */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Quote Icon */}
              <div className="absolute -top-6 -left-6">
                <FontAwesomeIcon 
                  icon={faQuoteLeft} 
                  className="text-6xl text-blue-200 opacity-50"
                />
              </div>

              {/* Message Card */}
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
                <div className="space-y-8">
                  {/* Opening Paragraph */}
                  <div className="relative">
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-8">
                      At The Ocean of Knowledge School, our mission is to provide a nurturing, disciplined, and inspiring environment where every child can discover their potential.
                    </p>
                  </div>

                  {/* Main Message Content */}
                  <div className="space-y-6">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      We believe that true education shapes character, strengthens confidence, and prepares students to face the challenges of tomorrow with wisdom and courage. Guided by our motto <span className="font-bold text-blue-600">"Go, Grow and Glow"</span>, we are committed to helping each learner move forward with purpose, grow through meaningful learning experiences, and shine brightly in their future endeavors.
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed">
                      Our dedicated teachers, supportive parents, and hardworking students form the foundation of our success. Together, we strive to build a school community that values knowledge, creativity, respect, and responsibility. As we continue to improve and expand, we remain focused on providing quality education that empowers children to become thoughtful, skilled, and successful individuals.
                    </p>

                    {/* Highlight Box */}
                    <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
                      <p className="text-lg font-semibold text-gray-900 italic">
                        "Together, we build futures—your dream, our lesson, your child."
                      </p>
                    </div>

                    {/* Closing */}
                    <div className="pt-8 mt-8 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">— Management Director</div>
                          <div className="text-gray-600 mt-1">The Ocean of Knowledge School System</div>
                        </div>
                        <div className="hidden md:block">
                          <FontAwesomeIcon 
                            icon={faSignature} 
                            className="text-4xl text-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                  <div className="text-sm font-semibold text-gray-700">Commitment</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="text-3xl font-bold text-teal-600 mb-2">Excellence</div>
                  <div className="text-sm font-semibold text-gray-700">Academic Focus</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="text-3xl font-bold text-purple-600 mb-2">Holistic</div>
                  <div className="text-sm font-semibold text-gray-700">Development</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">Community</div>
                  <div className="text-sm font-semibold text-gray-700">Partnership</div>
                </div>
              </div> */}

              {/* Final Note */}
              <div className="mt-12 text-center">
                <p className="text-gray-600 italic">
                  Join us in our journey to shape tomorrow's leaders with knowledge, values, and vision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}