import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faPlayCircle,
  faChevronRight,
  faChevronLeft,
  faRocket
} from '@fortawesome/free-solid-svg-icons'

// Import images
import display2 from '../assets/display/display2.jpg'
import display3 from '../assets/display/display3.jpg'
import display4 from '../assets/display/display4.jpg'
import display5 from '../assets/display/display5.jpg'
import Logo from '../assets/logo.png'
import { image } from 'fontawesome'
import { NavLink } from 'react-router-dom'

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: Logo,
      title: "",
      subtitle: ""
    },
    {
      image: display2,
      title: "Modern Classrooms",
      subtitle: "Equipped for 21st-century learning"
    },
    {
      image: display3,
      title: "Sports Facilities",
      subtitle: "Nurturing champions of tomorrow"
    },
    {
      image: display4,
      title: "Library Resources",
      subtitle: "A world of knowledge awaits"
    },
    {
      image: display5,
      title: "Campus Life",
      subtitle: "Vibrant community environment"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-900 to-green-950"></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20 inline-flex items-center">
                <FontAwesomeIcon icon={faRocket} className="mr-2" />
                Next Generation Education Platform
              </span>
            </div>

            <h1 className="text-5xl lg:text-5xl font-black text-white mb-6 leading-tight">
              The Ocean of Knowledge School System
            </h1>
            <h2 className="block text-black lg:text-2xl ">
              Kot Charbagh Swat
            </h2>

            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed font-light">
              Go, Grow & Glow — Empowering Students Through Formal, Informal & Non-Formal Education.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <NavLink to="/online-admission" className="group bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 transform flex items-center justify-center">
                <span>Enroll Your Child Now</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                />
              </NavLink>

              <button className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:scale-105 transform flex items-center justify-center backdrop-blur-sm">
                <FontAwesomeIcon icon={faPlayCircle} className="mr-2" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-blue-200 text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">200+</div>
                <div className="text-blue-200 text-sm">Schools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99%</div>
                <div className="text-blue-200 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Content - Slider */}
          <div className="relative">
            <div className="relative w-full aspect-[8/8] rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
              {/* Slides */}
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white mb-2">{slide.title}</h3>
                    <p className="text-white/90">{slide.subtitle}</p>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-6 bg-white' : 'bg-white/50 hover:bg-white/80'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Elements - keeping nice decorations */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-700"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection