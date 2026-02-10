import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '../../contexts/AuthContext'
import {
    faClock,
    faMapMarkerAlt,
    faPrint,
    faCalendarAlt,
    faSpinner,
    faExclamationTriangle,
    faBook,
    faSchool
} from '@fortawesome/free-solid-svg-icons'

const TeacherTimetable = () => {
    const { user } = useAuth()
    const [timetable, setTimetable] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTimetable = async () => {
            if (!user || !user.teacherId) {
                setError('Teacher ID not found. Please log in again.')
                setLoading(false)
                return
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/teachers/timetable/${user.teacherId}`)
                if (!response.ok) throw new Error('Failed to fetch timetable')
                const data = await response.json()
                setTimetable(data)
            } catch (err) {
                console.error('Error:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchTimetable()
    }, [user])

    const handlePrint = () => {
        window.print()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Loading your schedule...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-500 mb-4" />
                    <h3 className="text-xl font-bold text-red-800 mb-2">Oops!</h3>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-6 py-2 rounded-xl font-medium">Retry</button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 print:p-0 print:bg-white">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        My Daily Schedule
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Standard daily routine for your assigned classes
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="bg-white text-gray-600 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center"
                    >
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        Print Schedule
                    </button>
                </div>
            </div>

            {/* Timetable Content */}
            <div className="max-w-4xl mx-auto space-y-6">
                {timetable.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl p-12 text-center border-2 border-dashed border-gray-200">
                        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Scheduled Classes</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            You haven't been assigned to any classes in the master timetable yet.
                            Please contact the administrator for your schedule.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                            <h2 className="text-2xl font-bold">Standard Daily Timetable</h2>
                            <p className="text-blue-100 opacity-90">Daily routine for all assigned subjects</p>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {timetable.map((slot, index) => (
                                <div
                                    key={index}
                                    className="p-6 hover:bg-blue-50/30 transition-colors group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-6">
                                            <div className="w-32 flex-shrink-0">
                                                <div className="flex items-center text-blue-600 font-bold">
                                                    <FontAwesomeIcon icon={faClock} className="mr-2 text-sm opacity-60" />
                                                    {slot.startTime}
                                                </div>
                                                <div className="text-xs text-gray-400 ml-5 font-medium uppercase tracking-wider">to {slot.endTime}</div>
                                            </div>

                                            <div className="h-10 w-px bg-gray-200 hidden md:block"></div>

                                            <div>
                                                <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faBook} className="text-blue-500 text-sm" />
                                                    {slot.subject}
                                                </h4>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faSchool} className="text-xs" />
                                                        {slot.className}
                                                    </span>
                                                    {slot.room && (
                                                        <span className="text-sm text-gray-500 flex items-center">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
                                                            Room: {slot.room}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="hidden md:block">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Active Session</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Teacher Info Card (Print Only) */}
            <div className="hidden print:block mt-8 border-t-2 border-gray-800 pt-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-bold">Teacher: {user?.name}</p>
                        <p className="text-xs text-gray-600">ID: {user?.teacherId}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 italic">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeacherTimetable
