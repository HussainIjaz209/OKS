import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBook,
    faVideo,
    faFilePdf,
    faFileAlt,
    faCheckCircle,
    faPlayCircle,
    faClock,
    faDownload,
    faStar,
    faChartLine,
    faLightbulb,
    faGraduationCap,
    faTrophy,
    faBookOpen,
    faFileCode,
    faFileImage,
    faEye,
    faHeart,
    faShare,
    faFire,
    faAward
} from '@fortawesome/free-solid-svg-icons'

const Learning = () => {
    const [activeTab, setActiveTab] = useState('all')
    const [selectedSubject, setSelectedSubject] = useState('all')

    // Learning materials data
    const learningMaterials = [
        {
            id: 1,
            subject: 'Mathematics',
            title: 'Quadratic Equations - Complete Guide',
            type: 'video',
            duration: '45 mins',
            views: 234,
            likes: 89,
            thumbnail: 'https://via.placeholder.com/400x225/3b82f6/ffffff?text=Math+Video',
            instructor: 'Mr. Smith',
            progress: 60,
            difficulty: 'intermediate',
            rating: 4.8,
            description: 'Master quadratic equations with step-by-step explanations and practice problems.'
        },
        {
            id: 2,
            subject: 'Science',
            title: 'Photosynthesis Process Explained',
            type: 'video',
            duration: '30 mins',
            views: 456,
            likes: 234,
            thumbnail: 'https://via.placeholder.com/400x225/10b981/ffffff?text=Science+Video',
            instructor: 'Ms. Johnson',
            progress: 100,
            difficulty: 'beginner',
            rating: 4.9,
            description: 'Understand the complete process of photosynthesis with animations and real-life examples.'
        },
        {
            id: 3,
            subject: 'Mathematics',
            title: 'Algebra Formulas Cheat Sheet',
            type: 'pdf',
            size: '2.5 MB',
            pages: 12,
            downloads: 342,
            instructor: 'Mr. Smith',
            difficulty: 'beginner',
            rating: 4.7,
            description: 'Quick reference guide for all essential algebra formulas and equations.'
        },
        {
            id: 4,
            subject: 'English',
            title: 'Shakespeare - Romeo and Juliet Analysis',
            type: 'document',
            size: '1.8 MB',
            pages: 25,
            downloads: 156,
            instructor: 'Mr. Davis',
            difficulty: 'advanced',
            rating: 4.6,
            description: 'Comprehensive literary analysis of Romeo and Juliet with critical interpretations.'
        },
        {
            id: 5,
            subject: 'History',
            title: 'World War II Timeline Presentation',
            type: 'presentation',
            size: '5.2 MB',
            slides: 45,
            downloads: 278,
            instructor: 'Ms. Wilson',
            difficulty: 'intermediate',
            rating: 4.8,
            description: 'Visual timeline of major events during World War II with detailed explanations.'
        },
        {
            id: 6,
            subject: 'Science',
            title: 'Chemistry Lab Safety Guidelines',
            type: 'pdf',
            size: '1.2 MB',
            pages: 8,
            downloads: 412,
            instructor: 'Ms. Johnson',
            difficulty: 'beginner',
            rating: 4.9,
            description: 'Essential safety protocols and guidelines for chemistry laboratory work.'
        },
        {
            id: 7,
            subject: 'Mathematics',
            title: 'Calculus Basics - Derivatives',
            type: 'video',
            duration: '55 mins',
            views: 189,
            likes: 67,
            thumbnail: 'https://via.placeholder.com/400x225/8b5cf6/ffffff?text=Calculus+Video',
            instructor: 'Mr. Smith',
            progress: 25,
            difficulty: 'advanced',
            rating: 4.7,
            description: 'Introduction to derivatives with practical applications and problem-solving techniques.'
        },
        {
            id: 8,
            subject: 'English',
            title: 'Grammar Essentials Workbook',
            type: 'document',
            size: '3.1 MB',
            pages: 35,
            downloads: 523,
            instructor: 'Mr. Davis',
            difficulty: 'beginner',
            rating: 4.8,
            description: 'Comprehensive grammar workbook with exercises and answer keys.'
        }
    ]

    // Assignment data
    const assignments = [
        {
            id: 1,
            subject: 'Mathematics',
            title: 'Algebra Practice Problems',
            dueDate: 'Dec 16, 2024',
            status: 'pending',
            points: 50,
            submissions: 23,
            totalStudents: 30
        },
        {
            id: 2,
            subject: 'Science',
            title: 'Chemistry Lab Report',
            dueDate: 'Dec 18, 2024',
            status: 'submitted',
            points: 100,
            score: 92,
            submissions: 28,
            totalStudents: 30
        },
        {
            id: 3,
            subject: 'English',
            title: 'Persuasive Essay Writing',
            dueDate: 'Dec 20, 2024',
            status: 'pending',
            points: 75,
            submissions: 15,
            totalStudents: 30
        },
        {
            id: 4,
            subject: 'History',
            title: 'World War II Research Project',
            dueDate: 'Dec 25, 2024',
            status: 'in-progress',
            points: 150,
            submissions: 8,
            totalStudents: 30
        }
    ]

    // Subjects for filtering
    const subjects = ['All', 'Mathematics', 'Science', 'English', 'History']

    // Statistics
    const stats = {
        totalMaterials: learningMaterials.length,
        completedVideos: learningMaterials.filter(m => m.type === 'video' && m.progress === 100).length,
        totalVideos: learningMaterials.filter(m => m.type === 'video').length,
        pendingAssignments: assignments.filter(a => a.status === 'pending').length,
        avgScore: 88.5
    }

    const getTypeIcon = (type) => {
        switch (type) {
            case 'video': return faVideo
            case 'pdf': return faFilePdf
            case 'document': return faFileAlt
            case 'presentation': return faFileCode
            default: return faBook
        }
    }

    const getTypeColor = (type) => {
        switch (type) {
            case 'video': return 'from-blue-500 to-blue-600'
            case 'pdf': return 'from-red-500 to-red-600'
            case 'document': return 'from-green-500 to-green-600'
            case 'presentation': return 'from-purple-500 to-purple-600'
            default: return 'from-gray-500 to-gray-600'
        }
    }

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-100 text-green-700'
            case 'intermediate': return 'bg-yellow-100 text-yellow-700'
            case 'advanced': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
            case 'submitted': return 'bg-green-100 text-green-700 border-green-500'
            case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-500'
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-500'
            case 'overdue': return 'bg-red-100 text-red-700 border-red-500'
            default: return 'bg-gray-100 text-gray-700 border-gray-500'
        }
    }

    const filteredMaterials = learningMaterials.filter(material => {
        const typeMatch = activeTab === 'all' ||
            (activeTab === 'videos' && material.type === 'video') ||
            (activeTab === 'documents' && ['pdf', 'document', 'presentation'].includes(material.type))
        const subjectMatch = selectedSubject === 'all' || material.subject === selectedSubject
        return typeMatch && subjectMatch
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Learning Hub
                </h1>
                <p className="text-gray-600 text-lg">
                    Access study materials, video lectures, and assignments all in one place
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium mb-1">Total Resources</p>
                            <p className="text-3xl font-bold">{stats.totalMaterials}</p>
                        </div>
                        <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                            <FontAwesomeIcon icon={faBook} className="text-2xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Videos Completed</p>
                            <p className="text-3xl font-bold">{stats.completedVideos}/{stats.totalVideos}</p>
                        </div>
                        <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium mb-1">Pending Tasks</p>
                            <p className="text-3xl font-bold">{stats.pendingAssignments}</p>
                        </div>
                        <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                            <FontAwesomeIcon icon={faClock} className="text-2xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium mb-1">Average Score</p>
                            <p className="text-3xl font-bold">{stats.avgScore}%</p>
                        </div>
                        <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                            <FontAwesomeIcon icon={faTrophy} className="text-2xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Type Filter */}
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-600 mb-3">Filter by Type</p>
                        <div className="flex flex-wrap gap-3">
                            {['all', 'videos', 'documents'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${activeTab === tab
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subject Filter */}
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-600 mb-3">Filter by Subject</p>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all duration-300 font-medium text-gray-700"
                        >
                            {subjects.map((subject) => (
                                <option key={subject} value={subject.toLowerCase()}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Learning Materials Grid */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FontAwesomeIcon icon={faGraduationCap} className="mr-3 text-purple-600" />
                        Learning Materials
                    </h2>
                    <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-semibold text-sm">
                        {filteredMaterials.length} Resources
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMaterials.map((material) => (
                        <div
                            key={material.id}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                        >
                            {/* Thumbnail for videos */}
                            {material.type === 'video' && (
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                    <img
                                        src={material.thumbnail}
                                        alt={material.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="bg-white text-purple-600 rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                                            <FontAwesomeIcon icon={faPlayCircle} className="text-3xl" />
                                        </button>
                                    </div>
                                    {material.progress > 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-300">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                                style={{ width: `${material.progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-5">
                                {/* Type Icon for non-videos */}
                                {material.type !== 'video' && (
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getTypeColor(material.type)} flex items-center justify-center text-white text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <FontAwesomeIcon icon={getTypeIcon(material.type)} />
                                    </div>
                                )}

                                {/* Subject Badge */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        {material.subject}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(material.difficulty)}`}>
                                        {material.difficulty}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
                                    {material.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {material.description}
                                </p>

                                {/* Instructor */}
                                <p className="text-gray-500 text-sm mb-4">
                                    <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-purple-500" />
                                    {material.instructor}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    {material.type === 'video' ? (
                                        <>
                                            <span className="flex items-center">
                                                <FontAwesomeIcon icon={faClock} className="mr-1.5" />
                                                {material.duration}
                                            </span>
                                            <span className="flex items-center">
                                                <FontAwesomeIcon icon={faEye} className="mr-1.5" />
                                                {material.views}
                                            </span>
                                            <span className="flex items-center">
                                                <FontAwesomeIcon icon={faHeart} className="mr-1.5 text-red-500" />
                                                {material.likes}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{material.size}</span>
                                            <span className="flex items-center">
                                                <FontAwesomeIcon icon={faDownload} className="mr-1.5" />
                                                {material.downloads}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Rating */}
                                <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                                    <div className="flex items-center text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <FontAwesomeIcon
                                                key={i}
                                                icon={faStar}
                                                className={`text-xs ${i < Math.floor(material.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm font-semibold text-gray-700">{material.rating}</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    {material.type === 'video' ? (
                                        <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105">
                                            <FontAwesomeIcon icon={faPlayCircle} className="mr-2" />
                                            {material.progress > 0 ? 'Continue' : 'Watch Now'}
                                        </button>
                                    ) : (
                                        <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105">
                                            <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                            Download
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Assignments Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FontAwesomeIcon icon={faBookOpen} className="mr-3 text-pink-600" />
                        Active Assignments
                    </h2>
                    <span className="bg-pink-100 text-pink-700 px-4 py-2 rounded-xl font-semibold text-sm">
                        {assignments.length} Assignments
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assignments.map((assignment) => (
                        <div
                            key={assignment.id}
                            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                            {assignment.subject}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(assignment.status)}`}>
                                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1).replace('-', ' ')}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-lg mb-2">
                                        {assignment.title}
                                    </h3>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center">
                                        <FontAwesomeIcon icon={faClock} className="mr-2 text-orange-500" />
                                        Due Date
                                    </span>
                                    <span className="font-semibold text-gray-800">{assignment.dueDate}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center">
                                        <FontAwesomeIcon icon={faAward} className="mr-2 text-yellow-500" />
                                        Points
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                        {assignment.score ? `${assignment.score}/${assignment.points}` : assignment.points}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Class Progress</span>
                                    <span className="font-semibold text-gray-800">
                                        {assignment.submissions}/{assignment.totalStudents} submitted
                                    </span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                                        style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg ${assignment.status === 'submitted'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105'
                                }`}>
                                {assignment.status === 'submitted' ? (
                                    <>
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                        View Submission
                                    </>
                                ) : assignment.status === 'in-progress' ? (
                                    <>
                                        <FontAwesomeIcon icon={faFire} className="mr-2" />
                                        Continue Working
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
                                        Start Assignment
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Learning
