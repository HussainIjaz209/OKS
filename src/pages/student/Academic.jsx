import { useState } from 'react'
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
    faLanguage
} from '@fortawesome/free-solid-svg-icons'

const Academic = () => {
    const [activeTab, setActiveTab] = useState('timetable')

    const subjects = [
        {
            id: 1,
            name: 'Mathematics',
            teacher: 'Mr. Smith',
            code: 'MTH101',
            icon: faCalculator,
            color: 'blue',
            progress: 85,
            nextClass: 'Monday, 09:00 AM'
        },
        {
            id: 2,
            name: 'Science',
            teacher: 'Ms. Johnson',
            code: 'SCI102',
            icon: faFlask,
            color: 'green',
            progress: 78,
            nextClass: 'Monday, 10:30 AM'
        },
        {
            id: 3,
            name: 'English',
            teacher: 'Mr. Davis',
            code: 'ENG103',
            icon: faLanguage,
            color: 'purple',
            progress: 92,
            nextClass: 'Tuesday, 09:00 AM'
        },
        {
            id: 4,
            name: 'History',
            teacher: 'Ms. Wilson',
            code: 'HIS104',
            icon: faHistory,
            color: 'orange',
            progress: 88,
            nextClass: 'Wednesday, 11:30 AM'
        },
        {
            id: 5,
            name: 'Geography',
            teacher: 'Mr. Brown',
            code: 'GEO105',
            icon: faGlobe,
            color: 'teal',
            progress: 75,
            nextClass: 'Thursday, 01:00 PM'
        }
    ]

    const timetable = {
        Monday: [
            { time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'Room 101' },
            { time: '10:00 - 10:30', subject: 'Break', type: 'break' },
            { time: '10:30 - 11:30', subject: 'Science', teacher: 'Ms. Johnson', room: 'Lab 2' },
            { time: '11:30 - 12:30', subject: 'Computer Science', teacher: 'Mrs. Tech', room: 'Comp Lab' }
        ],
        Tuesday: [
            { time: '09:00 - 10:00', subject: 'English', teacher: 'Mr. Davis', room: 'Room 102' },
            { time: '10:00 - 10:30', subject: 'Break', type: 'break' },
            { time: '10:30 - 11:30', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'Room 101' },
            { time: '11:30 - 12:30', subject: 'History', teacher: 'Ms. Wilson', room: 'Room 103' }
        ],
        Wednesday: [
            { time: '09:00 - 10:00', subject: 'Science', teacher: 'Ms. Johnson', room: 'Lab 2' },
            { time: '10:00 - 10:30', subject: 'Break', type: 'break' },
            { time: '10:30 - 11:30', subject: 'Geography', teacher: 'Mr. Brown', room: 'Room 104' },
            { time: '11:30 - 12:30', subject: 'Sports', teacher: 'Coach Mike', room: 'Ground' }
        ],
        Thursday: [
            { time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'Room 101' },
            { time: '10:00 - 10:30', subject: 'Break', type: 'break' },
            { time: '10:30 - 11:30', subject: 'English', teacher: 'Mr. Davis', room: 'Room 102' },
            { time: '11:30 - 12:30', subject: 'Art', teacher: 'Ms. Creative', room: 'Art Room' }
        ],
        Friday: [
            { time: '09:00 - 10:00', subject: 'History', teacher: 'Ms. Wilson', room: 'Room 103' },
            { time: '10:00 - 10:30', subject: 'Break', type: 'break' },
            { time: '10:30 - 11:30', subject: 'Science', teacher: 'Ms. Johnson', room: 'Lab 2' },
            { time: '11:30 - 12:30', subject: 'Library', teacher: 'Mrs. Read', room: 'Library' }
        ]
    }

    const exams = [
        { subject: 'Mathematics', date: 'Dec 20, 2024', time: '09:00 AM', duration: '2 Hours', syllabus: 'Algebra, Geometry' },
        { subject: 'Science', date: 'Dec 22, 2024', time: '09:00 AM', duration: '2 Hours', syllabus: 'Physics, Chemistry' },
        { subject: 'English', date: 'Dec 24, 2024', time: '09:00 AM', duration: '1.5 Hours', syllabus: 'Grammar, Literature' }
    ]

    const getColorClass = (color) => {
        const colors = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600',
            teal: 'from-teal-500 to-teal-600'
        }
        return colors[color] || colors.blue
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Academic Overview
                </h1>
                <p className="text-gray-600 text-lg">
                    Manage your classes, subjects, and exam schedules
                </p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
                {['timetable', 'subjects', 'exams'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${activeTab === tab
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
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {Object.entries(timetable).map(([day, classes]) => (
                            <div key={day} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white text-center font-bold text-lg">
                                    {day}
                                </div>
                                <div className="p-4 space-y-4">
                                    {classes.map((cls, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-3 rounded-xl border-l-4 ${cls.type === 'break'
                                                    ? 'bg-orange-50 border-orange-400'
                                                    : 'bg-gray-50 border-blue-500'
                                                } hover:shadow-md transition-all duration-300`}
                                        >
                                            <p className="font-bold text-gray-800 text-sm">{cls.subject}</p>
                                            {cls.type !== 'break' && (
                                                <>
                                                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                                                        <FontAwesomeIcon icon={faClock} className="mr-1" /> {cls.time}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                                                        <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-1" /> {cls.teacher}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1 font-medium text-blue-600">
                                                        {cls.room}
                                                    </p>
                                                </>
                                            )}
                                            {cls.type === 'break' && (
                                                <p className="text-xs text-orange-500 mt-1 font-medium text-center">
                                                    {cls.time}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'subjects' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((subject) => (
                            <div key={subject.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getColorClass(subject.color)} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <FontAwesomeIcon icon={subject.icon} />
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                                        {subject.code}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-2">{subject.name}</h3>
                                <p className="text-gray-500 text-sm mb-4 flex items-center">
                                    <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
                                    {subject.teacher}
                                </p>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Course Progress</span>
                                        <span className="font-bold text-blue-600">{subject.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full bg-gradient-to-r ${getColorClass(subject.color)}`}
                                            style={{ width: `${subject.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <div className="text-xs text-gray-500">
                                        <p>Next Class:</p>
                                        <p className="font-medium text-gray-700">{subject.nextClass}</p>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'exams' && (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Subject</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Date & Time</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Duration</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Syllabus</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {exams.map((exam, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                                                        <FontAwesomeIcon icon={faFileAlt} />
                                                    </div>
                                                    <span className="font-bold text-gray-800">{exam.subject}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-medium">{exam.date}</div>
                                                <div className="text-xs text-gray-500">{exam.time}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {exam.duration}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {exam.syllabus}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    Upcoming
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Academic
