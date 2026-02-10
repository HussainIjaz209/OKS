import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChalkboardTeacher, faArrowRight, faUsers, faGraduationCap, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

const JobsSection = () => {
    const navigate = useNavigate()
    const containerRef = useRef(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [100, -100])
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0])

    const features = [
        {
            icon: faUsers,
            title: "Collaborative Environment",
            description: "Join a diverse team of passionate educators dedicated to excellence."
        },
        {
            icon: faGraduationCap,
            title: "Professional Growth",
            description: "Detailed professional development programs and career advancement opportunities."
        },
        {
            icon: faHandHoldingHeart,
            title: "Impactful Work",
            description: "Shape the future by nurturing young minds and building character."
        }
    ]

    return (
        <section ref={containerRef} className="py-24 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-[-50%] translate-y-[-50%]" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl translate-x-[50%] translate-y-[50%]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                            <span className="text-sm font-medium text-blue-200">We are Hiring</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Join Our Mission to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                Inspire Excellence
                            </span>
                        </h2>

                        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                            We're looking for passionate educators and staff who share our vision of providing world-class education. Become part of a legacy that values innovation, integrity, and student success.
                        </p>

                        <div className="space-y-6 mb-10">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="flex items-start"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mr-4 flex-shrink-0 border border-white/10 text-blue-400">
                                        <FontAwesomeIcon icon={feature.icon} size="lg" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-1 text-white">{feature.title}</h4>
                                        <p className="text-gray-400 text-sm">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/jobs')}
                            className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/25 flex items-center gap-3"
                        >
                            <FontAwesomeIcon icon={faChalkboardTeacher} />
                            Apply Now
                            <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>

                    <motion.div
                        style={{ y, opacity }}
                        className="relative lg:h-[600px] hidden lg:block"
                    >
                        {/* Abstract Decorative Cards */}
                        <div className="absolute top-10 right-10 w-64 h-80 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 transform rotate-6 z-20 hover:scale-105 transition-transform duration-500">
                            <div className="h-full flex flex-col justify-between">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-xl font-bold">A+</div>
                                <div>
                                    <div className="h-2 w-24 bg-white/20 rounded mb-2" />
                                    <div className="h-2 w-16 bg-white/10 rounded" />
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-40 left-10 w-72 h-64 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-md rounded-3xl border border-white/10 p-6 transform -rotate-3 z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-400/20" />
                                <div className="h-3 w-32 bg-white/20 rounded" />
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 w-full bg-white/10 rounded" />
                                <div className="h-2 w-5/6 bg-white/10 rounded" />
                                <div className="h-2 w-4/6 bg-white/10 rounded" />
                            </div>
                        </div>

                        <div className="absolute bottom-20 right-20 w-56 h-56 bg-gradient-to-tr from-purple-500/20 to-fuchsia-500/20 backdrop-blur-md rounded-full border border-white/10 z-30 flex items-center justify-center animate-float">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-1">50+</div>
                                <div className="text-xs text-purple-200 uppercase tracking-widest">Expert Teachers</div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default JobsSection
