import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBook,
    faCalendarAlt,
    faChalkboardTeacher,
    faClock,
    faFileAlt,
    faGraduationCap,
    faLaptopCode,
    faFlask,
    faCalculator,
    faGlobe,
    faHistory,
    faLanguage,
    faFilePdf,
    faDownload,
    faTimes
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext'

const Academic = () => {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('timetable')
    const [classData, setClassData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [materials, setMaterials] = useState([])
    const [loadingMaterials, setLoadingMaterials] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const fetchAcademicData = async () => {
            try {
                setLoading(true)
                const studentId = user?.studentId || user?.id || user?._id;

                if (!studentId || studentId === 'null') {
                    console.warn('Academic: Missing valid student ID');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/api/classes/student/${studentId}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch academic data')
                }
                const data = await response.json()
                setClassData(data)
                setLoading(false)
            } catch (err) {
                console.error('Error fetching academic data:', err)
                setError(err.message)
                setLoading(false)
            }
        }

        if (user) {
            fetchAcademicData()
        }
    }, [user])

    const handleViewCurriculum = async (subject) => {
        setSelectedSubject(subject)
        setIsModalOpen(true)
        setLoadingMaterials(true)
        try {
            const response = await fetch(`${API_BASE_URL}/api/materials/student?className=${classData.name}&section=${classData.section}&subject=${subject}`)
            const data = await response.json()
            setMaterials(data)
        } catch (err) {
            console.error('Error fetching materials:', err)
        } finally {
            setLoadingMaterials(false)
        }
    }

    const getSubjectIcon = (subjectName) => {
        const name = subjectName.toLowerCase()
        if (name.includes('math')) return faCalculator
        if (name.includes('science')) return faFlask
        if (name.includes('english')) return faLanguage
        if (name.includes('history')) return faHistory
        if (name.includes('geography')) return faGlobe
        if (name.includes('computer')) return faLaptopCode
        return faBook
    }

    const getColorClass = (index) => {
        const colors = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600',
            'from-purple-500 to-purple-600',
            'from-orange-500 to-orange-600',
            'from-teal-500 to-teal-600',
            'from-pink-500 to-pink-600',
            'from-indigo-500 to-indigo-600'
        ]
        return colors[index % colors.length]
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <div className="text-red-500 text-5xl mb-4">
                        <FontAwesomeIcon icon={faFileAlt} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    const timetable = {}
    if (classData?.timetable) {
        classData.timetable.forEach(slot => {
            const day = slot.day || 'Monday' // Fallback to Monday if day is missing
            if (!timetable[day]) {
                timetable[day] = []
            }
            timetable[day].push(slot)
        })
    }

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-4 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg">
                        <FontAwesomeIcon icon={faGraduationCap} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Academic Overview
                        </h1>
                        <p className="text-gray-600">
                            Class: <span className="font-bold text-blue-600">{classData?.name} - {classData?.section}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
                {['timetable', 'subjects'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap shadow-sm ${activeTab === tab
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-50 hover:shadow-md'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="animate-fade-in">
                {activeTab === 'timetable' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {daysOrder.map((day) => timetable[day] && (
                            <div key={day} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-all duration-300">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white text-center font-bold text-lg">
                                    {day}
                                </div>
                                <div className="p-4 space-y-4 flex-grow">
                                    {timetable[day].map((cls, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-4 rounded-xl border-l-4 transition-all duration-300 ${cls.subject.toLowerCase() === 'break'
                                                ? 'bg-orange-50 border-orange-400'
                                                : 'bg-slate-50 border-blue-500'
                                                } hover:scale-105 hover:shadow-md cursor-default`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="font-bold text-gray-800">{cls.subject}</p>
                                                {cls.subject.toLowerCase() !== 'break' && (
                                                    <FontAwesomeIcon icon={getSubjectIcon(cls.subject)} className="text-blue-500/50" />
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-gray-500 flex items-center">
                                                    <FontAwesomeIcon icon={faClock} className="mr-2 w-3" /> {cls.startTime} - {cls.endTime}
                                                </p>
                                                {cls.teacher && (
                                                    <p className="text-xs text-gray-500 flex items-center">
                                                        <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2 w-3" /> {cls.teacher}
                                                    </p>
                                                )}
                                                {cls.room && (
                                                    <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block mt-1">
                                                        {cls.room}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {Object.keys(timetable).length === 0 && (
                            <div className="col-span-full bg-white p-12 rounded-3xl text-center shadow-xl border border-dashed border-gray-300">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-6xl text-gray-200 mb-4" />
                                <h3 className="text-xl font-bold text-gray-800">No Timetable Set</h3>
                                <p className="text-gray-500">Your class timetable hasn't been uploaded yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'subjects' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-2xl">
                        {classData?.subjects?.map((subject, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-50 hover:shadow-2xl transition-all duration-300 group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getColorClass(index)} flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <FontAwesomeIcon icon={getSubjectIcon(subject)} />
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                                        Core
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-gray-800 mb-2">{subject}</h3>
                                <div className="h-1 w-12 bg-blue-600/20 mb-4 group-hover:w-20 transition-all duration-500"></div>

                                <p className="text-gray-500 text-sm mb-6 flex items-center">
                                    <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-3 text-blue-500" />
                                    Department Faculty
                                </p>

                                <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                                    <button
                                        onClick={() => handleViewCurriculum(subject)}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center group/btn"
                                    >
                                        View Curriculum
                                        <span className="ml-2 transform group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Curriculum/Materials Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedSubject} Curriculum</h2>
                                <p className="text-blue-100 text-sm">Study materials and resources</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {loadingMaterials ? (
                                <div className="py-20 text-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-500">Loading materials...</p>
                                </div>
                            ) : materials.length > 0 ? (
                                <div className="space-y-4">
                                    {materials.map((material) => (
                                        <div key={material._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-white hover:shadow-md transition-all group">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                                                    <FontAwesomeIcon icon={material.fileType === 'pdf' ? faFilePdf : faFileAlt} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800">{material.title}</h4>
                                                    <p className="text-xs text-gray-500">{material.fileSize} • Uploaded on {new Date(material.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <a
                                                href={`${API_BASE_URL}${material.fileUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-white text-gray-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm group-hover:scale-110"
                                            >
                                                <FontAwesomeIcon icon={faDownload} />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="text-gray-200 text-6xl mb-4">
                                        <FontAwesomeIcon icon={faBook} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">No Materials Yet</h3>
                                    <p className="text-gray-500">Curriculum materials for this subject haven't been uploaded yet.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 bg-white border border-slate-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Academic
