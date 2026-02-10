import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCalendarCheck,
    faSearch,
    faFilter,
    faCheck,
    faTimes,
    faExclamation,
    faSave,
    faHistory,
    faUserCheck,
    faChartPie,
    faSpinner,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext'

const TeacherAttendance = () => {
    const { user } = useAuth()
    const [managedClasses, setManagedClasses] = useState([])
    const [selectedClassId, setSelectedClassId] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [viewMode, setViewMode] = useState('mark')
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    const fetchManagedClasses = async () => {
        if (!user || !user.teacherId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/teachers/managed-classes/${user.teacherId}`);
            if (!response.ok) throw new Error('Failed to fetch managed classes');
            const data = await response.json();
            setManagedClasses(data);
            if (data.length > 0) {
                setSelectedClassId(data[0]._id);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const fetchClassStudents = async () => {
        if (!selectedClassId) return;
        setLoading(true);
        try {
            const cls = managedClasses.find(c => c._id === selectedClassId);
            if (!cls) return;

            const response = await fetch(`${API_BASE_URL}/api/students/class-students?className=${cls.name}&section=${cls.section}`);
            if (!response.ok) throw new Error('Failed to fetch students');
            const data = await response.json();
            setStudents(data);
        } catch (err) {
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManagedClasses();
    }, [user]);

    useEffect(() => {
        fetchClassStudents();
    }, [selectedClassId]);

    const stats = {
        present: students.filter(s => s.status === 'present').length,
        absent: students.filter(s => s.status === 'absent').length,
        late: students.filter(s => s.status === 'late').length,
        total: students.length
    }

    const handleStatusChange = (id, newStatus) => {
        setStudents(students.map(student =>
            student.id === id ? { ...student, status: newStatus } : student
        ))
    }

    const markAll = (status) => {
        setStudents(students.map(student => ({ ...student, status })))
    }

    const handleSaveAttendance = async () => {
        if (students.length === 0) return;
        setSaving(true);
        try {
            const attendanceData = students.map(s => ({
                studentId: s.id,
                status: s.status
            }));

            const response = await fetch(`${API_BASE_URL}/api/students/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attendanceData, date })
            });

            if (response.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                alert('Failed to save attendance');
            }
        } catch (err) {
            console.error('Error saving attendance:', err);
            alert('Error saving attendance');
        } finally {
            setSaving(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-700 border-green-200'
            case 'absent': return 'bg-red-100 text-red-700 border-red-200'
            case 'late': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    if (loading && managedClasses.length > 0 && students.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Attendance
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Mark and track student attendance
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setViewMode('mark')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${viewMode === 'mark'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
                        Mark Attendance
                    </button>
                    <button
                        onClick={() => setViewMode('history')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${viewMode === 'history'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <FontAwesomeIcon icon={faHistory} className="mr-2" />
                        History
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Class</label>
                            <select
                                className="w-full md:w-56 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-700"
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                            >
                                <option value="">Select a Class</option>
                                {managedClasses.map(cls => (
                                    <option key={cls._id} value={cls._id}>
                                        {cls.name} {cls.section}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                            <input
                                type="date"
                                className="w-full md:w-48 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-700"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {viewMode === 'mark' && students.length > 0 && (
                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                onClick={() => markAll('present')}
                                className="flex-1 md:flex-none px-4 py-2 bg-green-50 text-green-600 rounded-xl font-semibold hover:bg-green-100 transition-colors text-sm"
                            >
                                Mark All Present
                            </button>
                            <button
                                onClick={() => markAll('absent')}
                                className="flex-1 md:flex-none px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors text-sm"
                            >
                                Mark All Absent
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {viewMode === 'mark' ? (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-blue-500">
                            <p className="text-gray-500 text-sm font-medium">Class Roster</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-green-500">
                            <p className="text-gray-500 text-sm font-medium">Present</p>
                            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-red-500">
                            <p className="text-gray-500 text-sm font-medium">Absent</p>
                            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-yellow-500">
                            <p className="text-gray-500 text-sm font-medium">Late</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                        </div>
                    </div>

                    {/* Attendance List */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 min-h-[300px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin mb-4" />
                                <p className="text-gray-500 font-medium">Loading class roster...</p>
                            </div>
                        ) : students.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <FontAwesomeIcon icon={faUserCheck} className="text-5xl text-gray-200 mb-4" />
                                <h3 className="text-xl font-bold text-gray-800">No students found</h3>
                                <p className="text-gray-500">Please select a class managed as a Class Teacher.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Roll No</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Student Name</th>
                                            <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {students.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {student.rollNo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                                                    {student.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(student.status)}`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'present')}
                                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${student.status === 'present'
                                                                ? 'bg-green-500 text-white shadow-lg scale-110'
                                                                : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-500'
                                                                }`}
                                                            title="Present"
                                                        >
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'absent')}
                                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${student.status === 'absent'
                                                                ? 'bg-red-500 text-white shadow-lg scale-110'
                                                                : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500'
                                                                }`}
                                                            title="Absent"
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'late')}
                                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${student.status === 'late'
                                                                ? 'bg-yellow-500 text-white shadow-lg scale-110'
                                                                : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-500'
                                                                }`}
                                                            title="Late"
                                                        >
                                                            <FontAwesomeIcon icon={faExclamation} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end items-center gap-4">
                        {saveSuccess && (
                            <span className="text-green-600 font-bold flex items-center animate-bounce">
                                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                Attendance Saved!
                            </span>
                        )}
                        <button
                            onClick={handleSaveAttendance}
                            disabled={students.length === 0 || saving}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center disabled:opacity-50"
                        >
                            {saving ? (
                                <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                            ) : (
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                            )}
                            {saving ? 'Saving...' : 'Save Attendance'}
                        </button>
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FontAwesomeIcon icon={faChartPie} className="text-4xl text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Attendance History</h3>
                    <p className="text-gray-600 mb-8">View past attendance records and generate reports</p>
                    <button className="bg-white border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all">
                        View Full Report
                    </button>
                </div>
            )}
        </div>
    )
}

export default TeacherAttendance
