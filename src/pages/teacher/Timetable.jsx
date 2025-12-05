import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCalendarAlt,
    faClock,
    faMapMarkerAlt,
    faChalkboardTeacher,
    faUserGraduate,
    faPrint,
    faDownload,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons'

const TeacherTimetable = () => {
    const [currentDay, setCurrentDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }))

    // Mock Data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

    const schedule = {
        Monday: [
            { id: 1, time: '09:00 - 09:45', class: 'Class 9A', subject: 'Mathematics', room: 'Room 101', type: 'class' },
            { id: 2, time: '09:45 - 10:30', class: 'Class 10A', subject: 'Mathematics', room: 'Room 203', type: 'class' },
            { id: 3, time: '10:30 - 11:00', type: 'break', label: 'Morning Break' },
            { id: 4, time: '11:00 - 11:45', class: 'Class 9B', subject: 'Mathematics', room: 'Room 102', type: 'class' },
            { id: 5, time: '11:45 - 12:30', type: 'free', label: 'Free Period' }
        ],
        Tuesday: [
            { id: 1, time: '09:00 - 09:45', class: 'Class 9B', subject: 'Mathematics', room: 'Room 102', type: 'class' },
            { id: 2, time: '09:45 - 10:30', type: 'free', label: 'Preparation Time' },
            { id: 3, time: '10:30 - 11:00', type: 'break', label: 'Morning Break' },
            { id: 4, time: '11:00 - 11:45', class: 'Class 10A', subject: 'Mathematics', room: 'Room 203', type: 'class' },
            { id: 5, time: '11:45 - 12:30', class: 'Class 9A', subject: 'Mathematics', room: 'Room 101', type: 'class' }
        ],
        Wednesday: [
            { id: 1, time: '09:00 - 09:45', class: 'Class 10A', subject: 'Mathematics', room: 'Room 203', type: 'class' },
            { id: 2, time: '09:45 - 10:30', class: 'Class 9A', subject: 'Mathematics', room: 'Room 101', type: 'class' },
            { id: 3, time: '10:30 - 11:00', type: 'break', label: 'Morning Break' },
            { id: 4, time: '11:00 - 11:45', type: 'meeting', label: 'Department Meeting', room: 'Conf Room' },
            { id: 5, time: '11:45 - 12:30', class: 'Class 9B', subject: 'Mathematics', room: 'Room 102', type: 'class' }
        ],
        Thursday: [
            { id: 1, time: '09:00 - 09:45', type: 'free', label: 'Free Period' },
            { id: 2, time: '09:45 - 10:30', class: 'Class 9B', subject: 'Mathematics', room: 'Room 102', type: 'class' },
            { id: 3, time: '10:30 - 11:00', type: 'break', label: 'Morning Break' },
            { id: 4, time: '11:00 - 11:45', class: 'Class 9A', subject: 'Mathematics', room: 'Room 101', type: 'class' },
            { id: 5, time: '11:45 - 12:30', class: 'Class 10A', subject: 'Mathematics', room: 'Room 203', type: 'class' }
        ],
        Friday: [
            { id: 1, time: '09:00 - 09:45', class: 'Class 9A', subject: 'Mathematics', room: 'Room 101', type: 'class' },
            { id: 2, time: '09:45 - 10:30', class: 'Class 10A', subject: 'Mathematics', room: 'Room 203', type: 'class' },
            { id: 3, time: '10:30 - 11:00', type: 'break', label: 'Morning Break' },
            { id: 4, time: '11:00 - 11:45', type: 'free', label: 'Free Period' },
            { id: 5, time: '11:45 - 12:30', class: 'Class 9B', subject: 'Mathematics', room: 'Room 102', type: 'class' }
        ]
    }

    const getEventColor = (type) => {
        switch (type) {
            case 'class': return 'bg-white border-l-4 border-blue-500'
            case 'break': return 'bg-orange-50 border-l-4 border-orange-400'
            case 'free': return 'bg-green-50 border-l-4 border-green-400'
            case 'meeting': return 'bg-purple-50 border-l-4 border-purple-400'
            default: return 'bg-gray-50'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        My Timetable
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Weekly schedule and class timings
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white text-gray-600 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center">
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        Print
                    </button>
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center">
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Day Selector (Mobile) */}
            <div className="lg:hidden mb-6 overflow-x-auto pb-2">
                <div className="flex space-x-2">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => setCurrentDay(day)}
                            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${currentDay === day
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Timetable Grid */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                    {days.map((day) => (
                        <div
                            key={day}
                            className={`lg:block ${currentDay === day ? 'block' : 'hidden'}`}
                        >
                            <div className="bg-gray-50 p-4 text-center border-b border-gray-200">
                                <h3 className={`font-bold text-lg ${day === new Date().toLocaleDateString('en-US', { weekday: 'long' })
                                        ? 'text-blue-600'
                                        : 'text-gray-700'
                                    }`}>
                                    {day}
                                </h3>
                            </div>
                            <div className="p-4 space-y-4">
                                {schedule[day].map((slot) => (
                                    <div
                                        key={slot.id}
                                        className={`p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${getEventColor(slot.type)}`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-500 flex items-center">
                                                <FontAwesomeIcon icon={faClock} className="mr-1" />
                                                {slot.time}
                                            </span>
                                            {slot.type === 'class' && (
                                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">
                                                    {slot.class}
                                                </span>
                                            )}
                                        </div>

                                        {slot.type === 'class' ? (
                                            <>
                                                <h4 className="font-bold text-gray-800 mb-1">{slot.subject}</h4>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
                                                    {slot.room}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-2">
                                                <p className={`font-semibold ${slot.type === 'break' ? 'text-orange-600' :
                                                        slot.type === 'meeting' ? 'text-purple-600' : 'text-green-600'
                                                    }`}>
                                                    {slot.label}
                                                </p>
                                                {slot.room && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                                                        {slot.room}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center text-sm text-gray-600">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    Class
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <div className="w-3 h-3 bg-orange-400 rounded-full mr-2"></div>
                    Break
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    Free Period
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                    Meeting
                </div>
            </div>
        </div>
    )
}

export default TeacherTimetable
