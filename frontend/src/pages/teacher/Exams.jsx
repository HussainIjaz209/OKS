import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSearch,
    faTrophy,
    faUserGraduate,
    faCheckCircle,
    faSpinner,
    faArrowLeft,
    faSave,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext'

const TeacherExams = () => {
    const { user } = useAuth()
    const [exams, setExams] = useState([])
    const [classes, setClasses] = useState([])
    const [students, setStudents] = useState([])
    const [selectedExam, setSelectedExam] = useState(null)
    const [selectedClass, setSelectedClass] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingStudents, setLoadingStudents] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [marks, setMarks] = useState({}) // { studentId: { subjectName: obtainedMarks } }
    const [searchQuery, setSearchQuery] = useState('')

    const [profileData, setProfileData] = useState(null)
    const [teacherName, setTeacherName] = useState('')

    const fetchData = async () => {
        try {
            // 1. Fetch Teacher Profile First
            const profileRes = await fetch(`${API_BASE_URL}/api/teachers/profile/${user._id}`);
            const pData = await profileRes.json();
            if (profileRes.ok) {
                setProfileData(pData);
                setTeacherName(`${pData.firstName} ${pData.lastName}`);
            }

            // 2. Fetch Exams for Teacher
            const examsRes = await fetch(`${API_BASE_URL}/api/exams/teacher/${user._id}`);
            const examsData = await examsRes.json();

            if (examsData.success) setExams(examsData.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user?._id) fetchData();
    }, [user?._id]);

    const handleSelectExamClass = async (exam, cls) => {
        setSelectedExam(exam);
        setSelectedClass(cls);
        setLoadingStudents(true);
        try {
            // Fetch students and existing results in parallel
            const [studentsRes, resultsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/exams/mark-entry/${cls._id}`),
                fetch(`${API_BASE_URL}/api/exams/results/${exam._id}`)
            ]);

            const studentsData = await studentsRes.json();
            const resultsData = await resultsRes.json();

            if (studentsData.success) {
                setStudents(studentsData.data);

                // Pre-fill labels/marks from existing results
                const entry = {};
                studentsData.data.forEach(student => {
                    entry[student._id] = {};

                    const existingResult = resultsData.success
                        ? resultsData.data.find(r => r.student === student._id)
                        : null;

                    exam.sessions.forEach(session => {
                        const savedMark = existingResult?.marks?.find(m => m.subject === session.subject);
                        entry[student._id][session.subject] = savedMark ? savedMark.obtainedMarks : '';
                    });
                });
                setMarks(entry);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingStudents(false);
        }
    }

    const handleMarkChange = (studentId, subject, value) => {
        setMarks(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || {}),
                [subject]: value
            }
        }));
    }

    const handleSubmitResults = async () => {
        setSubmitting(true);
        try {
            const resultsPayload = students.map(student => {
                const studentMarks = marks[student._id] || {};

                // We only want to submit subjects that the teacher is actually editing
                // But for consistency with submitResults controller, we might need all sessions 
                // However, we should only overwrite/provide marks for what's in the UI
                const subjectsPayload = selectedExam.sessions.map(session => {
                    // Check if this subject is assigned to the teacher
                    const isAssigned = isSubjectAssigned(session.subject);

                    if (isAssigned) {
                        return {
                            subject: session.subject,
                            obtainedMarks: Number(studentMarks[session.subject] || 0),
                            totalMarks: session.totalMarks
                        };
                    } else {
                        // Keep existing mark if not assigned (fetch it from existing state or just don't include it if API allows)
                        // The submitResults controller does findOneAndUpdate with entire marks array
                        // So we MUST provide the existing marks for other subjects too
                        return {
                            subject: session.subject,
                            obtainedMarks: Number(studentMarks[session.subject] || 0),
                            totalMarks: session.totalMarks
                        };
                    }
                });

                return {
                    studentId: student._id,
                    marks: subjectsPayload
                };
            });

            const response = await fetch(`${API_BASE_URL}/api/exams/submit-results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    examId: selectedExam._id,
                    results: resultsPayload
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Marks updated successfully!');
                fetchData(); // Refresh
                setSelectedExam(null);
                setSelectedClass(null);
                setMarks({});
            }
        } catch (error) {
            console.error('Error submitting results:', error);
        } finally {
            setSubmitting(false);
        }
    }

    const isSubjectAssigned = (subject) => {
        if (!selectedClass || !teacherName || !profileData) return false;

        // Removed classTeacher bypass to enforce strict timetable-based subject filtering
        // This ensures teachers only see columns for subjects they actually teach in this class
        return selectedClass.timetable?.some(t =>
            t.subject?.toLowerCase().trim() === subject?.toLowerCase().trim() &&
            t.teacher?.toLowerCase().trim() === teacherName?.toLowerCase().trim()
        );
    }

    // Since we need profileData for classTeacher check, let's add it to state or just stick to name for now
    // Actually profileData is not in scope here, need to fix that.


    const filteredStudents = students.filter(s =>
        s.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.LastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.RollNo.toString().includes(searchQuery)
    )

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                {!selectedExam ? (
                    <>
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                Examination Portal
                            </h1>
                            <p className="text-gray-600 text-lg">Select an exam and class to enter student marks</p>
                        </div>

                        {exams.length === 0 ? (
                            <div className="col-span-full bg-white rounded-[2rem] p-12 text-center shadow-xl border border-gray-100">
                                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <FontAwesomeIcon icon={faTrophy} className="text-3xl opacity-20" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Exams Found</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    We couldn't find any exams for your assigned classes.
                                    Please ensure you are assigned to a class or listed in a class timetable.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {exams.map(exam => (
                                    <div key={exam._id} className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all p-8 flex flex-col h-full">
                                        <div className="mb-6">
                                            <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mb-4 inline-block">
                                                {exam.term}
                                            </span>
                                            <h3 className="text-2xl font-bold text-gray-800 uppercase leading-tight">{exam.title}</h3>
                                            <p className="text-gray-500 font-medium mt-1">Class: {exam.class?.name} - {exam.class?.section}</p>
                                        </div>

                                        <div className="space-y-3 mb-8 flex-1">
                                            {exam.sessions.map((s, i) => (
                                                <div key={i} className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600 font-semibold">{s.subject}</span>
                                                    <span className="text-gray-400">{s.totalMarks} Marks</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handleSelectExamClass(exam, exam.class)}
                                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 group-hover:scale-125 transition-transform" />
                                            Enter Marks
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="animate-fade-in">
                        {/* Mark Entry Header */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => { setSelectedExam(null); setSelectedClass(null); setMarks({}); }}
                                        className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-all"
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </button>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-800 uppercase">{selectedExam.title}</h2>
                                        <p className="text-blue-600 font-bold tracking-wide">
                                            {selectedClass.name} - {selectedClass.section} • {selectedExam.term}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-72">
                                        <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search student..."
                                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={handleSubmitResults}
                                        disabled={submitting}
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {submitting ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faSave} />}
                                        Save All Marks
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Students Table */}
                        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-separate border-spacing-0">
                                    <thead>
                                        <tr className="bg-slate-900 text-white">
                                            <th className="px-8 py-6 font-black uppercase text-xs tracking-widest rounded-tl-[2.5rem]">Student Info</th>
                                            {selectedExam.sessions.filter(s => isSubjectAssigned(s.subject)).map((session, idx) => (
                                                <th key={idx} className="px-6 py-6 font-black uppercase text-xs tracking-widest text-center">
                                                    {session.subject}
                                                    <span className="block text-[10px] text-slate-400 font-medium">Max: {session.totalMarks}</span>
                                                </th>
                                            ))}
                                            <th className="px-8 py-6 font-black uppercase text-xs tracking-widest text-right rounded-tr-[2.5rem]">Total / %</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loadingStudents ? (
                                            <tr>
                                                <td colSpan={selectedExam.sessions.length + 2} className="py-20 text-center">
                                                    <FontAwesomeIcon icon={faSpinner} className="text-3xl text-blue-600 animate-spin" />
                                                </td>
                                            </tr>
                                        ) : filteredStudents.map((student, sIdx) => {
                                            const studentMarks = marks[student._id] || {};
                                            let totalObtained = 0;
                                            let totalMax = 0;
                                            selectedExam.sessions.forEach(session => {
                                                if (isSubjectAssigned(session.subject)) {
                                                    totalObtained += Number(studentMarks[session.subject] || 0);
                                                    totalMax += session.totalMarks;
                                                }
                                            });
                                            const percentage = totalMax > 0 ? (totalObtained / totalMax * 100).toFixed(1) : 0;

                                            return (
                                                <tr key={student._id} className="hover:bg-blue-50/50 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                                                                {student.RollNo}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-gray-800">{student.FirstName} {student.LastName}</h4>
                                                                <p className="text-xs text-gray-400 font-medium">Roll No: {student.RollNo}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {selectedExam.sessions.filter(s => isSubjectAssigned(s.subject)).map((session, idx) => (
                                                        <td key={idx} className="px-6 py-6 text-center">
                                                            <input
                                                                type="number"
                                                                max={session.totalMarks}
                                                                min="0"
                                                                placeholder="0"
                                                                className={`w-20 text-center py-2.5 rounded-xl border-2 transition-all font-bold ${(studentMarks[session.subject] > session.totalMarks)
                                                                    ? 'border-red-500 bg-red-50 text-red-600'
                                                                    : 'border-slate-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                                                    }`}
                                                                value={studentMarks[session.subject] || ''}
                                                                onChange={(e) => handleMarkChange(student._id, session.subject, e.target.value)}
                                                            />
                                                        </td>
                                                    ))}
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="inline-block px-4 py-2 rounded-2xl bg-slate-900 text-white font-black text-sm">
                                                            {totalObtained} / {totalMax}
                                                            <span className={`ml-2 px-2 py-0.5 rounded-lg text-[10px] ${percentage >= 40 ? 'bg-green-500' : 'bg-red-500'}`}>
                                                                {percentage}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="mt-8 flex items-center gap-3 text-orange-600 font-bold text-sm bg-orange-100/50 p-4 rounded-2xl border border-orange-200">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                            Remember to click "Save All Marks" after entering scores for all students.
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TeacherExams;
