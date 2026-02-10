import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faSearch,
    faSchool,
    faChalkboardTeacher,
    faTrash,
    faEllipsisV,
    faTimes,
    faBook,
    faCalendarAlt,
    faClock,
    faPrint,
    faPen
} from '@fortawesome/free-solid-svg-icons'

const AdminClasses = () => {
    const [showModal, setShowModal] = useState(false)
    const [showTimetableModal, setShowTimetableModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [classes, setClasses] = useState([])
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedClass, setSelectedClass] = useState(null)
    const [selectedTimetable, setSelectedTimetable] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [currentClassId, setCurrentClassId] = useState(null)

    // Fetch Classes and Teachers
    const fetchData = async () => {
        try {
            const [classesRes, teachersRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/classes`),
                fetch(`${API_BASE_URL}/api/teachers`)
            ]);

            const classesData = await classesRes.json();
            const teachersData = await teachersRes.json();

            setClasses(classesData);
            setTeachers(teachersData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const [newClass, setNewClass] = useState({
        name: '',
        section: '',
        classTeacher: '',
        room: '',
        capacity: '',
        subjects: '' // Input as string, converted to array on submit
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = { ...newClass };
            // Convert subjects string to array
            if (typeof payload.subjects === 'string') {
                payload.subjects = payload.subjects.split(',').map(s => s.trim()).filter(s => s !== '');
            }

            const url = isEditing
                ? `${API_BASE_URL}/api/classes/${currentClassId}`
                : `${API_BASE_URL}/api/classes`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                fetchData();
                setShowModal(false);
                setNewClass({ name: '', section: '', classTeacher: '', room: '', capacity: '', subjects: '' });
                setIsEditing(false);
                setCurrentClassId(null);
            } else {
                alert(`Failed to ${isEditing ? 'update' : 'create'} class`);
            }
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} class:`, error);
        }
    }

    const handleEditClick = (cls) => {
        setIsEditing(true);
        setCurrentClassId(cls._id);
        setNewClass({
            name: cls.name || '',
            section: cls.section || '',
            classTeacher: cls.classTeacher?._id || '',
            room: cls.room || '',
            capacity: cls.capacity || '',
            subjects: Array.isArray(cls.subjects) ? cls.subjects.join(', ') : ''
        });
        setShowModal(true);
    }

    const handleDeleteClass = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await fetch(`${API_BASE_URL}/api/classes/${id}`, { method: 'DELETE' });
                fetchData();
            } catch (error) {
                console.error('Error deleting class:', error);
            }
        }
    }

    // Timetable Logic
    const handleOpenTimetable = (cls) => {
        setSelectedClass(cls);
        setSelectedTimetable(cls.timetable || []);
        setShowTimetableModal(true);
    }

    const handleTimetableChange = (index, field, value) => {
        const updatedTimetable = [...selectedTimetable];
        updatedTimetable[index] = {
            ...updatedTimetable[index],
            [field]: value
        };
        setSelectedTimetable(updatedTimetable);
    }

    const handleAddSlot = () => {
        setSelectedTimetable([...selectedTimetable, { startTime: '', endTime: '', subject: '', teacher: '' }]);
    }

    const handleRemoveSlot = (index) => {
        const updatedTimetable = selectedTimetable.filter((_, i) => i !== index);
        setSelectedTimetable(updatedTimetable);
    }

    const handleSaveTimetable = async () => {
        if (!selectedClass?._id) {
            alert('No class selected');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/classes/${selectedClass._id}/timetable`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timetable: selectedTimetable })
            });

            if (response.ok) {
                fetchData();
                setShowTimetableModal(false);
                alert('Timetable updated successfully');
            } else {
                alert('Failed to save timetable');
            }
        } catch (error) {
            console.error('Error saving timetable:', error);
            alert('Failed to save timetable');
        }
    }

    const handlePrintTimetable = () => {
        if (!selectedClass) return;
        const printWindow = window.open('', '_blank');
        const content = `
            <html>
                <head>
                    <title>Timetable - ${selectedClass.name}</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
                        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; margin-bottom: 30px; }
                        h1 { color: #4f46e5; margin: 0; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
                        th { background-color: #f9fafb; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em; }
                        tr:nth-child(even) { background-color: #fcfcfc; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Daily Timetable: ${selectedClass.name}</h1>
                        <div>Section: ${selectedClass.section}</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Subject</th>
                                <th>Teacher</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${selectedTimetable.map(slot => `
                                <tr>
                                    <td>${slot.startTime || '-'}</td>
                                    <td>${slot.endTime || '-'}</td>
                                    <td>${slot.subject || '-'}</td>
                                    <td>${slot.teacher || 'Not Assigned'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <script>window.print(); window.close();</script>
                </body>
            </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
    }


    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cls.classTeacher?.firstName || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Class Management
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Manage classes, sections, and timetables
                    </p>
                </div>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setNewClass({ name: '', section: '', classTeacher: '', room: '', capacity: '', subjects: '' });
                        setShowModal(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Class
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Classes</p>
                            <h3 className="text-3xl font-bold text-gray-800">{classes.length}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            <FontAwesomeIcon icon={faSchool} className="text-xl" />
                        </div>
                    </div>
                </div>
                {/* ... other stats ... */}
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="relative w-full md:w-96">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search classes..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((cls, idx) => (
                    <div key={cls?._id || idx} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group relative">
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => handleEditClick(cls)}
                                className="text-blue-400 hover:text-blue-600 transition-colors p-2"
                                title="Edit Class"
                            >
                                <FontAwesomeIcon icon={faPen} />
                            </button>
                        </div>

                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold mr-4 group-hover:scale-110 transition-transform duration-300">
                                {cls.section || 'A'}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{cls.name}</h3>
                                <p className="text-gray-500 text-sm">{cls.room || 'No Room'}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center">
                                    <FontAwesomeIcon icon={faChalkboardTeacher} className="w-5 mr-2 text-gray-400" />
                                    Class Teacher
                                </span>
                                <span className="font-semibold text-gray-700">{cls.classTeacher?.firstName || 'Not Assigned'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center">
                                    <FontAwesomeIcon icon={faBook} className="w-5 mr-2 text-gray-400" />
                                    Subjects
                                </span>
                                <span className="font-semibold text-gray-700">{cls.subjects?.length || 0}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => handleOpenTimetable(cls)}
                                className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-600 py-2 rounded-xl font-medium transition-colors text-sm flex items-center justify-center"
                            >
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                Timetable
                            </button>
                            <button
                                onClick={() => cls?._id && handleDeleteClass(cls._id)}
                                className="w-10 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Class Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">{isEditing ? 'Edit Class' : 'Add New Class'}</h2>
                            <button onClick={() => {
                                setShowModal(false);
                                setIsEditing(false);
                                setCurrentClassId(null);
                            }} className="text-white/80 hover:text-white transition-colors">
                                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* ... (existing fields) ... */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Class Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                    value={newClass.name}
                                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                    value={newClass.section}
                                    onChange={(e) => setNewClass({ ...newClass, section: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Class Teacher</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                    value={newClass.classTeacher}
                                    onChange={(e) => setNewClass({ ...newClass, classTeacher: e.target.value })}
                                >
                                    <option value="">Select Class Teacher (Optional)</option>
                                    {teachers && Array.isArray(teachers) && teachers.map(teacher => (
                                        <option key={teacher?._id} value={teacher?._id}>
                                            {teacher?.firstName} {teacher?.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Room Number</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                        value={newClass.room}
                                        onChange={(e) => setNewClass({ ...newClass, room: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
                                    <input type="number" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                        value={newClass.capacity}
                                        onChange={(e) => setNewClass({ ...newClass, capacity: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Subjects (Comma separated)</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                    placeholder="e.g. Math, English, Science"
                                    value={newClass.subjects}
                                    onChange={(e) => setNewClass({ ...newClass, subjects: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1 italic">Leave empty to use default subjects for this grade</p>
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
                                <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg">
                                    {isEditing ? 'Update Class' : 'Create Class'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Timetable Modal */}
            {showTimetableModal && selectedClass && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col animate-fade-in overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Daily Schedule: {selectedClass.name}</h2>
                                    <p className="text-purple-100 text-sm">One-time setup for the standard daily routine</p>
                                </div>
                                <button
                                    onClick={handlePrintTimetable}
                                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
                                >
                                    <FontAwesomeIcon icon={faPrint} />
                                    Print Timetable
                                </button>
                            </div>
                            <button onClick={() => setShowTimetableModal(false)} className="text-white/80 hover:text-white transition-colors">
                                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
                            <div className="max-w-4xl mx-auto space-y-4">
                                {/* Header Row */}
                                {selectedTimetable.length > 0 && (
                                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <div className="col-span-2">Start Time</div>
                                        <div className="col-span-2">End Time</div>
                                        <div className="col-span-3">Subject</div>
                                        <div className="col-span-4">Teacher</div>
                                        <div className="col-span-1 text-center">Delete</div>
                                    </div>
                                )}

                                {selectedTimetable.map((slot, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="col-span-2">
                                            <div className="relative">
                                                <FontAwesomeIcon icon={faClock} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                                <input
                                                    type="time"
                                                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                                    value={slot.startTime}
                                                    onChange={(e) => handleTimetableChange(index, 'startTime', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="relative">
                                                <FontAwesomeIcon icon={faClock} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                                <input
                                                    type="time"
                                                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                                    value={slot.endTime}
                                                    onChange={(e) => handleTimetableChange(index, 'endTime', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <select
                                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none transition-all"
                                                value={slot.subject}
                                                onChange={(e) => handleTimetableChange(index, 'subject', e.target.value)}
                                            >
                                                <option value="">Select Subject</option>
                                                {selectedClass.subjects?.map(subject => (
                                                    <option key={subject} value={subject}>{subject}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-4">
                                            <select
                                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none transition-all"
                                                value={slot.teacher}
                                                onChange={(e) => handleTimetableChange(index, 'teacher', e.target.value)}
                                            >
                                                <option value="">Select Teacher</option>
                                                {teachers && Array.isArray(teachers) && teachers.map(teacher => (
                                                    <option key={teacher?._id} value={`${teacher?.firstName} ${teacher?.lastName}`}>
                                                        {teacher?.firstName} {teacher?.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <button
                                                onClick={() => handleRemoveSlot(index)}
                                                className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={handleAddSlot}
                                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50/50 transition-all flex items-center justify-center group"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2 group-hover:scale-110 transition-transform" />
                                    <span className="font-semibold">Add New Subject Slot</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
                            <button
                                onClick={() => setShowTimetableModal(false)}
                                className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveTimetable}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                            >
                                Save Timetable
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminClasses
