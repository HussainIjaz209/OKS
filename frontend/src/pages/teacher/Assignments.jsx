import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '../../contexts/AuthContext'
import {
    faPlus,
    faSearch,
    faFilter,
    faEdit,
    faTrash,
    faCheckCircle,
    faClock,
    faFileAlt,
    faCalendarAlt,
    faTimes,
    faSpinner,
    faExclamationTriangle,
    faUsers,
    faDownload,
    faSchool,
    faUserGraduate
} from '@fortawesome/free-solid-svg-icons'

const TeacherAssignments = () => {
    const { user } = useAuth()
    const [assignments, setAssignments] = useState([])
    const [teacherClasses, setTeacherClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedClass, setSelectedClass] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)

    const [newAssignment, setNewAssignment] = useState({
        title: '',
        classInfo: '', // Will be name|section string
        subject: '',
        dueDate: '',
        points: 100,
        description: ''
    })

    const [markingAssignment, setMarkingAssignment] = useState(null)
    const [classStudents, setClassStudents] = useState([])
    const [fetchingStudents, setFetchingStudents] = useState(false)

    const fetchAssignments = async () => {
        if (!user || !user.teacherId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/assignments/teacher/${user.teacherId}`);
            if (!response.ok) throw new Error('Failed to fetch assignments');
            const data = await response.json();
            setAssignments(data);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        }
    };

    const fetchTeacherClasses = async () => {
        if (!user || !user.teacherId) return;
        try {
            // Reusing getTeacherTimetable to find classes, or we could have a specific endpoint
            // For now, let's fetch students which already has class info
            const response = await fetch(`${API_BASE_URL}/api/teachers/${user.teacherId}/students`);
            const students = await response.json();

            // Extract unique class|section pairs
            const uniqueClasses = Array.from(new Set(students.map(s => s.class)))
                .filter(c => c !== 'Unknown')
                .map(c => {
                    const parts = c.split(' ');
                    return {
                        full: c,
                        name: parts[0] + (parts.length > 2 ? ' ' + parts[1] : ''),
                        section: parts[parts.length - 1]
                    };
                });

            setTeacherClasses(uniqueClasses);
        } catch (err) {
            console.error('Error fetching classes:', err);
        }
    };

    useEffect(() => {
        const loadPageData = async () => {
            setLoading(true);
            await Promise.all([fetchAssignments(), fetchTeacherClasses()]);
            setLoading(false);
        };
        loadPageData();
    }, [user]);

    const handleCreateAssignment = async (e) => {
        e.preventDefault()
        try {
            const [className, section] = newAssignment.classInfo.split('|');
            const formData = new FormData();
            formData.append('title', newAssignment.title);
            formData.append('description', newAssignment.description);
            formData.append('className', className);
            formData.append('section', section);
            formData.append('subject', newAssignment.subject);
            formData.append('teacher', user.teacherId);
            formData.append('dueDate', newAssignment.dueDate);
            formData.append('points', newAssignment.points);

            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const response = await fetch(`${API_BASE_URL}/api/assignments`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                await fetchAssignments();
                setShowCreateModal(false);
                setNewAssignment({
                    title: '',
                    classInfo: '',
                    subject: '',
                    dueDate: '',
                    points: 100,
                    description: ''
                });
                setSelectedFile(null);
            } else {
                alert('Failed to create assignment');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error creating assignment');
        }
    }

    const handleDeleteAssignment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this assignment?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/assignments/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setAssignments(assignments.filter(a => a._id !== id));
            } else {
                alert('Failed to delete assignment');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }

    const openMarkingModal = async (assignment) => {
        setMarkingAssignment(assignment);
        setFetchingStudents(true);
        try {
            // First get all students for this teacher to find the ones in this specific class
            const response = await fetch(`${API_BASE_URL}/api/teachers/${user.teacherId}/students`);
            const allStudents = await response.json();

            // Filter students by assignment's className
            const relevantStudents = allStudents.filter(s => s.class === assignment.className);
            setClassStudents(relevantStudents);
        } catch (err) {
            console.error('Error fetching students for marking:', err);
        } finally {
            setFetchingStudents(false);
        }
    }

    const handleMarkStatus = async (studentId, currentStatus) => {
        const newStatus = currentStatus === 'submitted' ? 'pending' : 'submitted';
        try {
            const response = await fetch(`${API_BASE_URL}/api/assignments/${markingAssignment._id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, status: newStatus })
            });

            if (response.ok) {
                const data = await response.json();
                // Update local markingAssignment state
                setMarkingAssignment(data.assignment);
                // Update main assignments list
                setAssignments(assignments.map(a => a._id === markingAssignment._id ? data.assignment : a));
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
    }

    const getStudentStatus = (studentId) => {
        const submission = markingAssignment?.submissions?.find(s => String(s.student) === String(studentId));
        return submission ? submission.status : 'pending';
    }

    const filteredAssignments = assignments.filter(assignment => {
        const matchesClass = selectedClass === 'all' || assignment.className === selectedClass
        const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesClass && matchesSearch
    })

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-200'
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Assignments
                    </h1>
                    <p className="text-gray-600 text-lg">Manage class tasks and homework</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Create Assignment
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 border-l-4 border-l-blue-500">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative">
                            <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="all">All My Classes</option>
                                {teacherClasses.map(cls => (
                                    <option key={cls.full} value={cls.full}>{cls.full}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="relative w-full md:w-64">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search assignments..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-6">
                {filteredAssignments.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-lg border-2 border-dashed border-gray-200">
                        <FontAwesomeIcon icon={faFileAlt} className="text-4xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800">No assignments found</h3>
                        <p className="text-gray-500">Start by creating your first assignment for the class.</p>
                    </div>
                ) : (
                    filteredAssignments.map((assignment) => (
                        <div key={assignment._id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all group border-l-4 border-l-indigo-500">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="lg:w-48 flex flex-col justify-center items-start border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 lg:pr-6">
                                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border ${getStatusColor(assignment.status)}`}>
                                        {assignment.status}
                                    </div>
                                    <div className="flex items-center text-gray-600 font-semibold mb-1">
                                        <FontAwesomeIcon icon={faSchool} className="mr-2 text-blue-500" />
                                        {assignment.className}
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2 text-xl font-bold text-gray-800">
                                        <h3>{assignment.title}</h3>
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm">{assignment.points} Pts</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">{assignment.description}</p>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-2 text-sm text-indigo-600 font-semibold">
                                            <FontAwesomeIcon icon={faEdit} className="text-xs" />
                                            Subject: {assignment.subject}
                                        </div>
                                        {assignment.file && (
                                            <a
                                                href={`${API_BASE_URL}${assignment.file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:underline bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faDownload} className="text-xs" />
                                                View Attachment
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="lg:w-48 flex flex-col justify-center items-end gap-3 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                                    <button
                                        onClick={() => openMarkingModal(assignment)}
                                        className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold py-2 px-4 rounded-xl transition-colors flex items-center justify-center"
                                    >
                                        <FontAwesomeIcon icon={faUsers} className="mr-2" />
                                        Mark Students
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAssignment(assignment._id)}
                                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-xl transition-colors flex items-center justify-center"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center text-white">
                            <h2 className="text-2xl font-bold text-white">New Assignment</h2>
                            <button onClick={() => setShowCreateModal(false)}><FontAwesomeIcon icon={faTimes} className="text-white text-2xl" /></button>
                        </div>
                        <form onSubmit={handleCreateAssignment} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                    <input type="text" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                        value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Class</label>
                                    <select required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                        value={newAssignment.classInfo} onChange={(e) => setNewAssignment({ ...newAssignment, classInfo: e.target.value })}
                                    >
                                        <option value="">Select Class</option>
                                        {teacherClasses.map(cls => (
                                            <option key={cls.full} value={`${cls.name}|${cls.section}`}>{cls.full}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                    <input type="text" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                        placeholder="e.g., Mathematics"
                                        value={newAssignment.subject} onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                                    <input type="date" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                        value={newAssignment.dueDate} onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Attachment (Optional)</label>
                                    <input
                                        type="file"
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Points</label>
                                    <input type="number" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                        placeholder="100"
                                        value={newAssignment.points} onChange={(e) => setNewAssignment({ ...newAssignment, points: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea required rows="4" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 resize-none"
                                    value={newAssignment.description} onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
                                <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg">Post Assignment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Marking Modal */}
            {markingAssignment && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100">
                        <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
                            <div>
                                <h2 className="text-2xl font-black text-white px-1">Mark Submissions</h2>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
                                    <FontAwesomeIcon icon={faSchool} className="mr-2" />
                                    {markingAssignment.className} • {markingAssignment.title}
                                </p>
                            </div>
                            <button
                                onClick={() => setMarkingAssignment(null)}
                                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>
                        </div>

                        <div className="p-8 max-h-[60vh] overflow-y-auto bg-slate-50/50">
                            {fetchingStudents ? (
                                <div className="py-20 text-center">
                                    <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin mb-4" />
                                    <p className="text-slate-500 font-bold">Fetching class students...</p>
                                </div>
                            ) : classStudents.length === 0 ? (
                                <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-amber-500 mb-4" />
                                    <p className="text-slate-600 font-bold">No students found for this class.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {classStudents.map((student) => {
                                        const status = getStudentStatus(student.id);
                                        return (
                                            <div key={student.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                                        <FontAwesomeIcon icon={faUserGraduate} className="text-xl" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800">{student.name}</p>
                                                        <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Roll No: {student.rollNo}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleMarkStatus(student.id, status)}
                                                    className={`px-6 py-2.5 rounded-2xl font-black text-sm transition-all transform active:scale-95 flex items-center gap-2 ${status === 'submitted'
                                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    <FontAwesomeIcon icon={status === 'submitted' ? faCheckCircle : faClock} />
                                                    {status === 'submitted' ? 'Submitted' : 'Pending'}
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-white border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setMarkingAssignment(null)}
                                className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherAssignments
