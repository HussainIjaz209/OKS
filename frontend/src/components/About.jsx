import React from 'react'

export default function About() {
  return (
    <div className="about-section py-12 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
            About Our School
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">
                The Ocean of Knowledge School
              </h1>
              <p className="text-lg text-gray-600 italic">
                Kot Charbagh, Swat, Pakistan
              </p>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              A growing educational institution dedicated to shaping bright futures. 
              We offer quality education up to Grade 10, focusing on academic excellence, 
              character building, and modern learning practices.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-xl border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-blue-800 mb-3">
                Our Guiding Motto
              </h3>
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold text-blue-500">"</div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-teal-700">
                    Go, Grow, and Glow
                  </p>
                  <p className="text-gray-600 mt-2">
                    We encourage students to move forward with confidence, 
                    grow through knowledge and discipline, and shine in every aspect of life.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Our Mission</h3>
                  <p className="text-gray-700">
                    To provide quality education that empowers young learners to become 
                    responsible, skilled, and successful individuals through committed 
                    teachers and a nurturing environment.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-teal-500 text-white p-5 rounded-xl text-center">
                <div className="text-3xl font-bold mb-2">10th</div>
                <div className="font-semibold">Grade Level</div>
                <p className="text-sm opacity-90 mt-1">Education up to Middle Level</p>
              </div>

              <div className="bg-gradient-to-br from-teal-500 to-blue-500 text-white p-5 rounded-xl text-center">
                <div className="text-3xl font-bold mb-2">Modern</div>
                <div className="font-semibold">Learning Practices</div>
                <p className="text-sm opacity-90 mt-1">Innovative Teaching Methods</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-5 rounded-xl border border-teal-100">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Our Commitment
              </h4>
              <p className="text-gray-700">
                With a team of dedicated educators and a supportive learning environment, 
                we are committed to nurturing the next generation of leaders and innovators.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-100">
          <div className="text-center">
            <p className="text-xl text-blue-800 font-semibold">
              Join us in our journey to shape tomorrow's leaders today!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}