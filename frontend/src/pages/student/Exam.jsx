import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFileAlt,
    faCalendarAlt,
    faIdCard,
    faPoll,
    faClock,
    faMapMarkerAlt,
    faDownload,
    faPrint,
    faUserGraduate,
    faGraduationCap
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext'

const Exam = () => {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('schedules')
    const [exams, setExams] = useState([])
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchExamData = async () => {
            try {
                setLoading(true)
                const studentId = user?.studentId || user?.id || user?._id;

                if (!studentId || studentId === 'null') {
                    console.warn('Exam: Missing valid student ID');
                    setLoading(false);
                    return;
                }

                const [examsRes, resultsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/exams/my-exams/${studentId}`),
                    fetch(`${API_BASE_URL}/api/exams/my-results/${studentId}`)
                ])

                const examsData = await examsRes.json()
                const resultsData = await resultsRes.json()

                if (examsData.success) setExams(examsData.data)
                if (resultsData.success) setResults(resultsData.data)

                setLoading(false)
            } catch (err) {
                console.error('Error fetching exam data:', err)
                setError('Failed to load exam information')
                setLoading(false)
            }
        }

        if (user?.id || user?.studentId) {
            fetchExamData()
        }
    }, [user])

    const calculateGrade = (percentage, className) => {
        const p = Number(percentage);
        const name = className?.toLowerCase() || '';

        // Formula 1: Play Group, Foundation 1, Foundation 2, Grade 1, Grade 2
        const isFormula1 = name.includes('play') ||
            name.includes('foundation') ||
            name.includes('grade 1') ||
            name.includes('grade 2') ||
            name.includes('class 1') ||
            name.includes('class 2');

        if (isFormula1) {
            if (p >= 91) return 'A+';
            if (p >= 86) return 'A';
            if (p >= 81) return 'B';
            if (p >= 75) return 'C';
            return 'F';
        } else {
            // Formula 2: Grade 3 to Grade 10
            if (p >= 91) return 'A+';
            if (p >= 80) return 'A';
            if (p >= 70) return 'B';
            if (p >= 60) return 'C';
            return 'F';
        }
    }

    const handlePrintSlip = (exam) => {
        const printWindow = window.open('', '_blank')
        printWindow.document.write(`
            <html>
                <head>
                    <title>Roll Number Slip - ${exam.title}</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    <style>
                        @media print {
                            .no-print { display: none; }
                            body { padding: 20px; }
                        }
                    </style>
                </head>
                <body class="p-8">
                    <div class="max-w-2xl mx-auto border-4 border-double border-blue-900 p-8">
                        <div class="text-center mb-8 border-b-2 border-blue-900 pb-4">
                            <h1 class="text-3xl font-bold text-blue-900 uppercase">OKS Management System</h1>
                            <h2 class="text-xl font-semibold text-gray-700">Roll Number Slip (Examination)</h2>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 mb-8">
                            <div>
                                <p class="text-sm text-gray-500">Student Name</p>
                                <p class="font-bold text-lg">${user.name}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Exam Term</p>
                                <p class="font-bold text-lg">${exam.title}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Roll Number</p>
                                <p class="font-bold text-lg">${user.rollNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Class</p>
                                <p class="font-bold text-lg">Current Grade</p>
                            </div>
                        </div>

                        <table class="w-full mb-8">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="border p-2 text-left">Subject</th>
                                    <th class="border p-2 text-left">Date</th>
                                    <th class="border p-2 text-left">Time</th>
                                    <th class="border p-2 text-left">Room</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${exam.sessions.map(s => `
                                    <tr>
                                        <td class="border p-2">${s.subject}</td>
                                        <td class="border p-2">${new Date(s.date).toLocaleDateString()}</td>
                                        <td class="border p-2">${s.startTime}</td>
                                        <td class="border p-2">${s.room || 'TBA'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>

                        <div class="mt-12 flex justify-between">
                            <div class="text-center w-32">
                                <div class="border-t border-gray-400 mt-8 pt-2 text-xs">Exams Controller</div>
                            </div>
                            <div class="text-center w-32">
                                <div class="border-t border-gray-400 mt-8 pt-2 text-xs">Principal/Head</div>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `)
        printWindow.document.close()
        printWindow.print()
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Exam Portal
                    </h1>
                    <p className="text-gray-600 font-medium">Manage your exam schedules, results, and slips</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 overflow-x-auto pb-4 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 pt-2">
                {[
                    { id: 'schedules', label: 'Exam Schedules', icon: faCalendarAlt },
                    { id: 'slips', label: 'Roll No Slips', icon: faIdCard },
                    { id: 'marks', label: 'Marks Sheets', icon: faPoll }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow-md ${activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <FontAwesomeIcon icon={tab.icon} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="animate-fade-in">
                {activeTab === 'schedules' && (
                    <div className="space-y-6">
                        {exams.length > 0 ? exams.map((exam) => (
                            <div key={exam._id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-bold">{exam.title}</h3>
                                        <p className="text-blue-100">{exam.term}</p>
                                    </div>
                                    <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md">
                                        {exam.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="px-6 py-4 text-left text-sm font-black text-gray-400 uppercase">Subject</th>
                                                    <th className="px-6 py-4 text-left text-sm font-black text-gray-400 uppercase">Date</th>
                                                    <th className="px-6 py-4 text-left text-sm font-black text-gray-400 uppercase">Time</th>
                                                    <th className="px-6 py-4 text-left text-sm font-black text-gray-400 uppercase">Room</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {exam.sessions.map((session, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-gray-800">{session.subject}</td>
                                                        <td className="px-6 py-4 text-gray-600">{new Date(session.date).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 flex items-center text-gray-600">
                                                            <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
                                                            {session.startTime} ({session.duration})
                                                        </td>
                                                        <td className="px-6 py-4 text-blue-600 font-bold">{session.room || 'TBA'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white p-20 rounded-3xl text-center shadow-xl border-2 border-dashed border-gray-200">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-7xl text-gray-200 mb-6" />
                                <h3 className="text-2xl font-bold text-gray-800">No Exams Scheduled</h3>
                                <p className="text-gray-500">When exams are scheduled for your class, they will appear here.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'slips' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.filter(e => e.status !== 'completed').map((exam) => (
                            <div key={exam._id} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-50 hover:shadow-2xl transition-all duration-300 relative group">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FontAwesomeIcon icon={faIdCard} className="text-8xl text-blue-900" />
                                </div>
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-lg">
                                        <FontAwesomeIcon icon={faFileAlt} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{exam.title}</h3>
                                        <p className="text-gray-500 text-sm">{exam.term}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Student Name:</span>
                                        <span className="text-gray-800 font-bold">{user.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Roll Number:</span>
                                        <span className="text-gray-800 font-bold">{user.rollNumber || user.id || user._id}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handlePrintSlip(exam)}
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center space-x-3"
                                >
                                    <FontAwesomeIcon icon={faPrint} />
                                    <span>Print Roll Slip</span>
                                </button>
                            </div>
                        ))}
                        {exams.filter(e => e.status !== 'completed').length === 0 && (
                            <div className="col-span-full bg-white p-20 rounded-3xl text-center shadow-xl">
                                <FontAwesomeIcon icon={faIdCard} className="text-7xl text-gray-200 mb-6" />
                                <h3 className="text-2xl font-bold text-gray-800">No Slips Available</h3>
                                <p className="text-gray-500">Roll number slips are available once exams are scheduled.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'marks' && (
                    <div className="space-y-8">
                        {results.length > 0 ? results.map((result) => (
                            <div key={result._id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <h3 className="text-3xl font-black mb-1">{result.exam?.title}</h3>
                                            <p className="text-emerald-50 opacity-90">{result.exam?.term} Result Card</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md text-center min-w-[100px]">
                                                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Percentage</p>
                                                <p className="text-2xl font-black">{result.percentage}%</p>
                                            </div>
                                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md text-center min-w-[100px]">
                                                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Grade</p>
                                                <p className="text-2xl font-black">{calculateGrade(result.percentage, result.student?.class?.name)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left border-b-2 border-slate-100">
                                                <th className="px-6 py-4 text-sm font-black text-slate-400 uppercase">Subject</th>
                                                <th className="px-6 py-4 text-sm font-black text-slate-400 uppercase text-center">Marks Obtained</th>
                                                <th className="px-6 py-4 text-sm font-black text-slate-400 uppercase text-center">Total Marks</th>
                                                <th className="px-6 py-4 text-sm font-black text-slate-400 uppercase text-center">Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {result.marks.map((mark, mIdx) => (
                                                <tr key={mIdx} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                                                                {mark.subject.charAt(0)}
                                                            </div>
                                                            <span className="font-bold text-gray-800">{mark.subject}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-bold text-gray-800">{mark.obtainedMarks}</td>
                                                    <td className="px-6 py-4 text-center font-medium text-gray-500">{mark.totalMarks}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold">
                                                            {calculateGrade((mark.obtainedMarks / mark.totalMarks) * 100, result.student?.class?.name)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
                                        <div className="text-right">
                                            <p className="text-gray-500 text-sm font-bold uppercase mb-1">Status</p>
                                            <p className={`text-2xl font-black ${result.resultStatus === 'Pass' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {result.resultStatus}ed
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white p-20 rounded-3xl text-center shadow-xl">
                                <FontAwesomeIcon icon={faPoll} className="text-7xl text-gray-200 mb-6" />
                                <h3 className="text-2xl font-bold text-gray-800">No Results Found</h3>
                                <p className="text-gray-500">Your mark sheets will appear here once results are announced.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Exam
