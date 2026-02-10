import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUserCheck,
    faStar,
    faCommentDots,
    faSave,
    faUserGraduate,
    faSpinner,
    faCheckCircle,
    faCalendarAlt
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext'

const Evaluation = () => {
    const { user } = useAuth()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const [formData, setFormData] = useState({
        studentId: '',
        term: 'Final Term',
        academicYear: '2023-24',
        overallComments: '',
        evaluations: [
            // Behavioral
            { category: 'Behavioral', question: 'Students follow classroom rules and instructions.', score: 5 },
            { category: 'Behavioral', question: 'Students show respect toward the teacher.', score: 5 },
            { category: 'Behavioral', question: 'Students maintain discipline during lectures.', score: 5 },
            { category: 'Behavioral', question: 'Students avoid disruptive behavior (talking, phone use, noise).', score: 5 },
            // Participation
            { category: 'Participation', question: 'Students actively participate in class discussions.', score: 5 },
            { category: 'Participation', question: 'Students ask relevant questions related to the topic.', score: 5 },
            { category: 'Participation', question: 'Students show interest in the subject being taught.', score: 5 },
            { category: 'Participation', question: 'Students cooperate during group or practical activities.', score: 5 },
            // Academic Preparedness
            { category: 'Academic Preparedness', question: 'Students complete assignments on time.', score: 5 },
            { category: 'Academic Preparedness', question: 'Students take quizzes/tests seriously.', score: 5 },
            { category: 'Academic Preparedness', question: 'Students come prepared with required materials.', score: 5 },
            { category: 'Academic Preparedness', question: 'Students follow academic integrity (no cheating or plagiarism).', score: 5 },
            // Attitude
            { category: 'Attitude', question: 'Students communicate politely with the teacher and peers.', score: 5 },
            { category: 'Attitude', question: 'Students accept feedback positively.', score: 5 },
            { category: 'Attitude', question: 'Students show willingness to learn and improve.', score: 5 },
        ]
    })

    const [submittedEvaluations, setSubmittedEvaluations] = useState([])

    const fetchTeacherEvaluations = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/evaluations/teacher/${user.teacherId}`)
            const data = await response.json()
            if (data.success) {
                setSubmittedEvaluations(data.data)
            }
        } catch (error) {
            console.error('Error fetching teacher evaluations:', error)
        }
    }

    const fetchStudents = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/teachers/${user.teacherId}/students`)
            const data = await response.json()
            setStudents(data)
        } catch (error) {
            console.error('Error fetching students:', error)
        }
    }

    const loadData = async () => {
        setLoading(true)
        await Promise.all([fetchStudents(), fetchTeacherEvaluations()])
        setLoading(false)
    }

    useEffect(() => {
        if (user?.teacherId) loadData()
    }, [user])

    const isSubmitted = (studentId) => {
        return submittedEvaluations.some(e =>
            (String(e.student?._id) === String(studentId) || String(e.student) === String(studentId)) &&
            e.term === formData.term &&
            e.academicYear === formData.academicYear
        )
    }

    const handleScoreChange = (index, score) => {
        const newEvaluations = [...formData.evaluations]
        newEvaluations[index].score = score
        setFormData({ ...formData, evaluations: newEvaluations })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.studentId) {
            alert('Please select a student')
            return
        }

        setSubmitting(true)
        try {
            const selectedStudent = students.find(s => String(s.id) === String(formData.studentId) || String(s._id) === String(formData.studentId));

            const response = await fetch(`${API_BASE_URL}/api/evaluations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    teacherId: user.teacherId,
                    classId: selectedStudent?.classId // Optional, if available
                })
            })

            if (response.ok) {
                setSuccessMessage('Evaluation submitted successfully!')
                fetchTeacherEvaluations() // Refresh the submitted list
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => setSuccessMessage(''), 3000)
                // Optional: Reset form keeping term/year
                setFormData({
                    ...formData,
                    studentId: '',
                    overallComments: '',
                    evaluations: formData.evaluations.map(e => ({ ...e, score: 5 }))
                })
            }
        } catch (error) {
            console.error('Error submitting evaluation:', error)
            alert('Failed to submit evaluation')
        } finally {
            setSubmitting(false)
        }
    }

    const categories = ['Behavioral', 'Participation', 'Academic Preparedness', 'Attitude']

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 mb-2">Student Evaluation</h1>
                        <p className="text-slate-500 font-medium text-lg italic">Assess and track student progress effectively</p>
                    </div>
                </div>

                {successMessage && (
                    <div className="mb-8 p-4 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center animate-bounce">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-3 text-xl" />
                        <span className="font-bold">{successMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info Selection */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-wider mb-2">Select Student</label>
                            <select
                                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                required
                            >
                                <option value="">Choose a student...</option>
                                {students.map(s => {
                                    const submitted = isSubmitted(s.id || s._id);
                                    return (
                                        <option key={s.id || s._id} value={s.id || s._id} className={submitted ? 'text-emerald-600 font-bold' : ''}>
                                            {submitted ? '✅ ' : '⏳ '} {s.name} ({s.class}) - Roll {s.rollNo}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-wider mb-2">Term</label>
                            <select
                                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                value={formData.term}
                                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                            >
                                <option value="First Term">First Term</option>
                                <option value="Mid-Term">Mid-Term</option>
                                <option value="Final Term">Final Term</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-wider mb-2">Academic Year</label>
                            <input
                                type="text"
                                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                value={formData.academicYear}
                                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                                placeholder="e.g. 2023-24"
                            />
                        </div>
                    </div>

                    {/* Questions Grouped by Category */}
                    {categories.map(cat => (
                        <div key={cat} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                            <div className="px-8 py-5 bg-slate-800 text-white flex items-center justify-between">
                                <h3 className="text-xl font-bold tracking-tight">{cat}</h3>
                                <div className="text-slate-400 text-xs font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                                    {formData.evaluations.filter(e => e.category === cat).length} Questions
                                </div>
                            </div>
                            <div className="p-8 space-y-8">
                                {formData.evaluations.map((evalItem, idx) => (
                                    evalItem.category === cat && (
                                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                            <div className="flex-1">
                                                <p className="text-slate-700 font-bold mb-1">{evalItem.question}</p>
                                                <div className="flex items-center text-xs text-slate-400 uppercase font-black tracking-tighter">
                                                    <span className="bg-slate-50 px-2 py-0.5 rounded-md">Evaluation Item {idx + 1}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => handleScoreChange(idx, star)}
                                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${evalItem.score >= star
                                                            ? 'bg-blue-600 text-white shadow-lg'
                                                            : 'bg-slate-50 text-slate-300 hover:text-blue-400 hover:bg-slate-100'
                                                            }`}
                                                    >
                                                        <FontAwesomeIcon icon={faStar} className={evalItem.score >= star ? 'animate-pulse' : ''} />
                                                    </button>
                                                ))}
                                                <span className="ml-4 w-8 text-center font-black text-2xl text-slate-800">{evalItem.score}</span>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Overall Comments */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                                <FontAwesomeIcon icon={faCommentDots} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Overall Remarks</h3>
                        </div>
                        <textarea
                            className="w-full h-40 px-6 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium resize-none shadow-inner"
                            placeholder="Add your detailed teacher observations here..."
                            value={formData.overallComments}
                            onChange={(e) => setFormData({ ...formData, overallComments: e.target.value })}
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-12 py-5 rounded-3xl bg-slate-900 text-white font-black text-lg shadow-2xl hover:bg-blue-600 transition-all flex items-center space-x-4 ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                        >
                            {submitting ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                    <span>Processing Submission...</span>
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faSave} />
                                    <span>Submit Final Evaluation</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Evaluation
