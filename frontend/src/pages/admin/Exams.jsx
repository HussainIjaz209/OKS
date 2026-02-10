import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faSearch,
    faCalendarAlt,
    faClock,
    faMapMarkerAlt,
    faTrophy,
    faTrash,
    faEdit,
    faTimes,
    faCheckCircle,
    faExclamationCircle,
    faChevronRight,
    faMagic,
    faPrint,
    faDownload
} from '@fortawesome/free-solid-svg-icons'

const ExamManagement = () => {
    const [exams, setExams] = useState([])
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showAutoModal, setShowAutoModal] = useState(false)
    const [showResultsModal, setShowResultsModal] = useState(false)
    const [viewingFullExam, setViewingFullExam] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [currentExamId, setCurrentExamId] = useState(null)
    const [activeTab, setActiveTab] = useState('upcoming')
    const [searchQuery, setSearchQuery] = useState('')

    const [marksData, setMarksData] = useState({
        exam: null,
        students: [],
        entry: {} // { studentId: { subjectName: marks } }
    })

    const [autoExam, setAutoExam] = useState({
        title: '',
        term: 'Final Term',
        startDate: '',
        startTime: '09:00'
    })

    const [newExam, setNewExam] = useState({
        title: '',
        class: '',
        term: 'Final Term',
        sessions: [
            { subject: '', date: '', startTime: '', duration: '', room: '', totalMarks: 100 }
        ],
        status: 'Upcoming'
    })

    const fetchData = async () => {
        try {
            const [examsRes, classesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/exams`),
                fetch(`${API_BASE_URL}/api/classes`)
            ]);
            const examsData = await examsRes.json();
            const classesData = await classesRes.json();

            if (examsData.success) setExams(examsData.data);
            setClasses(classesData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching exam data:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddSession = () => {
        setNewExam({
            ...newExam,
            sessions: [...newExam.sessions, { subject: '', date: '', startTime: '09:00', duration: '3h', room: 'Exam Hall', totalMarks: 100 }]
        })
    }

    const handleRemoveSession = (index) => {
        const updatedSessions = newExam.sessions.filter((_, i) => i !== index);
        setNewExam({ ...newExam, sessions: updatedSessions });
    }

    const handleSessionChange = (index, field, value) => {
        const updatedSessions = [...newExam.sessions];
        updatedSessions[index][field] = value;
        setNewExam({ ...newExam, sessions: updatedSessions });
    }

    const handleEditExam = (exam) => {
        setEditMode(true);
        setCurrentExamId(exam._id);
        setNewExam({
            title: exam.title,
            class: exam.class?._id || exam.class,
            term: exam.term,
            sessions: exam.sessions.map(s => ({
                ...s,
                date: new Date(s.date).toISOString().split('T')[0]
            })),
            status: exam.status
        });
        setShowModal(true);
    }

    const handleDeleteExam = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam? This will also delete all associated results.')) {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/exams/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (data.success) {
                    fetchData();
                } else {
                    alert(data.message || 'Failed to delete exam');
                }
            } catch (error) {
                console.error('Error deleting exam:', error);
                alert('An error occurred while deleting the exam');
            } finally {
                setLoading(false);
            }
        }
    }

    const handleSaveExam = async (e) => {
        e.preventDefault();
        try {
            const url = editMode
                ? `${API_BASE_URL}/api/exams/${currentExamId}`
                : `${API_BASE_URL}/api/exams`;
            const method = editMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newExam)
            });
            if (response.ok) {
                fetchData();
                setShowModal(false);
                setEditMode(false);
                setNewExam({
                    title: '',
                    class: '',
                    term: 'Final Term',
                    sessions: [{ subject: '', date: '', startTime: '', duration: '', room: '', totalMarks: 100 }],
                    status: 'Upcoming'
                });
            } else {
                alert('Failed to save exam');
            }
        } catch (error) {
            console.error('Error saving exam:', error);
        }
    }

    const handleAutoGenerate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/exams/generate-auto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(autoExam)
            });
            const data = await response.json();

            if (data.success) {
                alert('Auto-generation complete! Schedules created for all classes.');
                setShowAutoModal(false);
                fetchData();
            } else {
                alert(data.message || 'Auto-generation failed');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error auto-generating exams:', error);
            setLoading(false);
            alert('An error occurred during auto-generation');
        }
    }

    const handleManageResults = async (exam) => {
        try {
            setLoading(true);
            const classId = exam.class?._id || exam.class;
            const res = await fetch(`${API_BASE_URL}/api/exams/mark-entry/${classId}`);
            const data = await res.json();

            if (data.success) {
                // Fetch existing results for this exam
                const resultsRes = await fetch(`${API_BASE_URL}/api/exams/results/${exam._id}`);
                const resultsData = await resultsRes.json();

                const entry = {}; // Initialize marks entry object
                data.data.forEach(student => {
                    entry[student._id] = {};

                    // Look for existing result for this student
                    const existingResult = resultsData.success
                        ? resultsData.data.find(r => r.student === student._id)
                        : null;

                    exam.sessions.forEach(session => {
                        // Pre-fill if mark exists
                        const savedMark = existingResult?.marks?.find(m => m.subject === session.subject);
                        entry[student._id][session.subject] = savedMark ? savedMark.obtainedMarks : '';
                    });
                });

                setMarksData({
                    exam,
                    students: data.data,
                    entry
                });
                setShowResultsModal(true);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching students:', error);
            setLoading(false);
        }
    }

    const handleSubmitResults = async () => {
        try {
            setLoading(true);
            const formattedResults = Object.keys(marksData.entry).map(studentId => {
                const studentMarks = marksData.entry[studentId];
                const marks = Object.keys(studentMarks).map(subject => ({
                    subject,
                    obtainedMarks: Number(studentMarks[subject]) || 0,
                    totalMarks: marksData.exam.sessions.find(s => s.subject === subject)?.totalMarks || 100
                }));
                return { studentId, marks };
            });

            const res = await fetch(`${API_BASE_URL}/api/exams/submit-results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    examId: marksData.exam._id,
                    results: formattedResults
                })
            });

            const data = await res.json();
            if (data.success) {
                alert('Results submitted successfully');
                setShowResultsModal(false);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error submitting results:', error);
            setLoading(false);
        }
    }

    const handlePrintResults = () => {
        const { exam, students, entry } = marksData;
        const printWindow = window.open('', '_blank');

        const sessions = exam.sessions;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Result Sheet - ${exam.title}</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
                    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .logo { height: 80px; }
                    .school-info { text-align: right; }
                    .school-name { font-size: 24px; font-weight: bold; color: #1e40af; }
                    .exam-info { margin-bottom: 30px; }
                    .exam-title { font-size: 28px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
                    .class-info { font-size: 18px; color: #666; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 12px 8px; text-align: center; }
                    th { background-color: #f8fafc; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
                    .student-info { text-align: left; font-weight: bold; }
                    .total-cell { background-color: #f1f5f9; font-weight: bold; }
                    .percentage { font-size: 11px; color: #64748b; }
                    @media print {
                        body { padding: 20px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="/src/assets/logo.png" className="logo" alt="Logo" onerror="this.style.display='none'" />
                    <div class="school-info">
                        <div class="school-name">The Ocean of Knowledge School</div>
                        <div>Excellence in Education</div>
                    </div>
                </div>

                <div class="exam-info">
                    <div class="exam-title">${exam.title}</div>
                    <div class="class-info">Class: ${exam.class?.name} (${exam.class?.section}) | Term: ${exam.term}</div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th class="student-info">Student Name (Roll No)</th>
                            ${sessions.map(s => `<th>${s.subject}<br/><span class="percentage">Max: ${s.totalMarks}</span></th>`).join('')}
                            <th>Total Obtained</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map(student => {
            const studentMarks = entry[student._id] || {};
            let totalObtained = 0;
            let totalMax = 0;

            const subjectMarksHtml = sessions.map(s => {
                const mark = Number(studentMarks[s.subject]) || 0;
                totalObtained += mark;
                totalMax += s.totalMarks;
                return `<td>${mark}</td>`;
            }).join('');

            const percentage = totalMax > 0 ? (totalObtained / totalMax * 100).toFixed(1) : 0;

            return `
                                <tr>
                                    <td class="student-info">${student.FirstName} ${student.LastName} (${student.RollNo || 'N/A'})</td>
                                    ${subjectMarksHtml}
                                    <td class="total-cell">${totalObtained} / ${totalMax}</td>
                                    <td class="total-cell">${percentage}%</td>
                                </tr>
                            `;
        }).join('')}
                    </tbody>
                </table>

                <div style="margin-top: 50px; display: flex; justify-content: space-between;">
                    <div style="border-top: 1px solid #333; width: 200px; text-align: center; padding-top: 5px;">Principal Signature</div>
                    <div style="border-top: 1px solid #333; width: 200px; text-align: center; padding-top: 5px;">Class Teacher Signature</div>
                </div>

                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    }


    const handleDownloadDMC = async (student) => {
        try {
            setLoading(true);
            const currentExam = marksData.exam;
            const classId = currentExam.class?._id || currentExam.class;

            // 1. Fetch all exams to find previous terms for this class
            const examsRes = await fetch(`${API_BASE_URL}/api/exams`);
            const examsData = await examsRes.json();

            let termExams = {};
            if (examsData.success) {
                // Filter exams for this class
                const classExams = examsData.data.filter(e =>
                    (e.class?._id === classId || e.class === classId)
                );

                // Identify terms
                termExams['First Term'] = classExams.find(e => e.term === 'First Term');
                termExams['Mid-Term'] = classExams.find(e => e.term === 'Mid-Term');
                termExams['Final Term'] = classExams.find(e => e.term === 'Final Term');
            }

            // 2. Fetch results for each term
            let termResults = {};
            for (const [term, exam] of Object.entries(termExams)) {
                if (exam) {
                    const res = await fetch(`${API_BASE_URL}/api/exams/results/${exam._id}`);
                    const data = await res.json();
                    if (data.success) {
                        const studentResult = data.data.find(r => r.student === student._id);
                        if (studentResult) {
                            termResults[term] = studentResult.marks;
                        }
                    }
                }
            }

            // 3. Aggregate data by subject
            const subjects = currentExam.sessions.map(s => s.subject);

            let subjectData = {};
            subjects.forEach(subj => {
                subjectData[subj] = {
                    first: termResults['First Term']?.find(m => m.subject === subj)?.obtainedMarks || '-',
                    mid: termResults['Mid-Term']?.find(m => m.subject === subj)?.obtainedMarks || '-',
                    final: termResults['Final Term']?.find(m => m.subject === subj)?.obtainedMarks || '-',
                    finalTotal: currentExam.sessions.find(s => s.subject === subj)?.totalMarks || 100
                };

                // Use live data for current term
                const currentTerm = currentExam.term;
                const liveMark = marksData.entry[student._id]?.[subj];

                if (currentTerm === 'First Term') subjectData[subj].first = liveMark !== undefined ? liveMark : subjectData[subj].first;
                if (currentTerm === 'Mid-Term') subjectData[subj].mid = liveMark !== undefined ? liveMark : subjectData[subj].mid;
                if (currentTerm === 'Final Term') subjectData[subj].final = liveMark !== undefined ? liveMark : subjectData[subj].final;
            });

            // Calculate totals
            let grandTotalObtained = 0;
            let grandTotalMax = 0;

            const processedRows = subjects.map(subj => {
                const d = subjectData[subj];
                const first = Number(d.first) || 0;
                const mid = Number(d.mid) || 0;
                const final = Number(d.final) || 0;

                // Sum obtained marks
                const totalObtained = first + mid + final;

                // Calculate Max (Sum max marks of all terms)
                let maxFirst = termExams['First Term']?.sessions.find(s => s.subject === subj)?.totalMarks || 0;
                let maxMid = termExams['Mid-Term']?.sessions.find(s => s.subject === subj)?.totalMarks || 0;
                let maxFinal = termExams['Final Term']?.sessions.find(s => s.subject === subj)?.totalMarks || 0;

                // Use current exam's max for its term if available
                if (currentExam.term === 'First Term') maxFirst = currentExam.sessions.find(s => s.subject === subj)?.totalMarks || 100;
                if (currentExam.term === 'Mid-Term') maxMid = currentExam.sessions.find(s => s.subject === subj)?.totalMarks || 100;
                if (currentExam.term === 'Final Term') maxFinal = currentExam.sessions.find(s => s.subject === subj)?.totalMarks || 100;

                const totalMax = maxFirst + maxMid + maxFinal;

                grandTotalObtained += totalObtained;
                grandTotalMax += totalMax;

                const percentage = totalMax > 0 ? (totalObtained / totalMax * 100).toFixed(1) : 0;

                let grade = '';
                if (percentage >= 90) grade = 'A+';
                else if (percentage >= 80) grade = 'A';
                else if (percentage >= 70) grade = 'B';
                else if (percentage >= 60) grade = 'C';
                else if (percentage >= 50) grade = 'D';
                else grade = 'F';

                return { subject: subj, first, mid, final, totalObtained, totalMax, percentage, grade };
            });

            const overallPercentage = grandTotalMax > 0 ? (grandTotalObtained / grandTotalMax * 100).toFixed(2) : 0;
            let overallGrade = '';
            if (overallPercentage >= 90) overallGrade = 'A+';
            else if (overallPercentage >= 80) overallGrade = 'A';
            else if (overallPercentage >= 70) overallGrade = 'B';
            else if (overallPercentage >= 60) overallGrade = 'C';
            else if (overallPercentage >= 50) overallGrade = 'D';
            else overallGrade = 'F';

            const printWindow = window.open('', '_blank');
            const studentImgWithFallback = student.profilePicture
                ? `${API_BASE_URL}${student.profilePicture}`
                : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

            const html = `
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>DMC - ${student.FirstName} ${student.LastName}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        @media print {
                            .no-print { display: none; }
                            body { padding: 0 !important; margin: 0 !important; -webkit-print-color-adjust: exact; }
                            .print-border { border: none !important; }
                        }
                        @page { size: A4; margin: 5mm; }
                    </style>
                </head>
                <body class="bg-gray-50 p-2 font-serif text-sm">
                    
                    <div class="print-border max-w-[210mm] mx-auto bg-white p-4 border-4 border-double border-blue-900 shadow-2xl min-h-[290mm]">
                        
                        <!-- Header -->
                        <div class="flex items-center justify-between border-b-4 border-blue-900 pb-2 mb-4 gap-2">
                            <div class="w-24 text-center">
                                <img src="/src/assets/logo.png" alt="Logo" class="w-20 h-20 object-contain mx-auto" onerror="this.outerHTML='<div class=\'w-20 h-20 bg-blue-900 text-white flex items-center justify-center rounded-lg text-xs font-bold font-sans\'>OKS</div>'">
                            </div>
                            <div class="flex-1 text-center">
                                <h1 class="text-3xl font-black text-blue-900 uppercase mb-1 tracking-wide font-sans">
                                    The Ocean of Knowledge School
                                </h1>
                                <p class="text-sm text-gray-700 font-bold uppercase tracking-widest mb-0.5">
                                    Kot, Charbagh Swat
                                </p>
                                <p class="text-xs text-gray-600 mb-2 font-mono">
                                    Phone: 03462064044 | www.portal.studentcare.pk
                                </p>
                                <div class="inline-block bg-blue-900 text-white text-lg font-bold px-6 py-1 rounded-full uppercase tracking-wider shadow-md">
                                    Detailed Marks Certificate
                                </div>
                            </div>
                            <div class="w-24 text-center">
                                <img src="${studentImgWithFallback}" alt="Student" class="w-20 h-24 object-cover border-2 border-blue-900 shadow-md mx-auto" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png'">
                            </div>
                        </div>

                        <!-- Info Grid -->
                        <div class="bg-blue-50 p-3 rounded-xl border border-blue-100 mb-4">
                            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                                <div>
                                    <p class="text-[10px] text-blue-800 font-bold uppercase tracking-wider mb-0.5">Student Name</p>
                                    <p class="text-sm font-bold text-gray-900 border-b border-blue-200 pb-0.5">${student.FirstName} ${student.LastName}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] text-blue-800 font-bold uppercase tracking-wider mb-0.5">Father's Name</p>
                                    <p class="text-sm font-bold text-gray-900 border-b border-blue-200 pb-0.5">${student.GuardianName || student.fatherName || 'N/A'}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] text-blue-800 font-bold uppercase tracking-wider mb-0.5">Roll Number</p>
                                    <p class="text-sm font-bold text-gray-900 border-b border-blue-200 pb-0.5">${student.RollNo || 'N/A'}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] text-blue-800 font-bold uppercase tracking-wider mb-0.5">Class</p>
                                    <p class="text-sm font-bold text-gray-900 border-b border-blue-200 pb-0.5">${currentExam.class?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] text-blue-800 font-bold uppercase tracking-wider mb-0.5">Registration No</p>
                                    <p class="text-sm font-bold text-gray-900 border-b border-blue-200 pb-0.5">${student._id}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] text-blue-800 font-bold uppercase tracking-wider mb-0.5">Session</p>
                                    <p class="text-sm font-bold text-gray-900 border-b border-blue-200 pb-0.5">2024-2025</p>
                                </div>
                                <div class="col-span-2">
                                    <p class="text-[10px] text-blue-800 font-bold uppercase tracking-wider mb-0.5">Exam Title</p>
                                    <p class="text-sm font-bold text-gray-900 border-b border-blue-200 pb-0.5">${currentExam.title}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Marks Table -->
                        <div class="overflow-hidden rounded-t-xl border border-gray-300 mb-4">
                            <table class="w-full text-center border-collapse text-xs">
                                <thead>
                                    <tr class="bg-blue-900 text-white">
                                        <th class="p-2 text-left border-r border-blue-800 w-1/4">Subject</th>
                                        <th class="p-1 border-r border-blue-800">1st Term</th>
                                        <th class="p-1 border-r border-blue-800">2nd Term</th>
                                        <th class="p-1 border-r border-blue-800">Final Term</th>
                                        <th class="p-1 border-r border-blue-800 bg-blue-800">Obtained</th>
                                        <th class="p-1 border-r border-blue-800">Total</th>
                                        <th class="p-1 border-r border-blue-800">%age</th>
                                        <th class="p-1">Grade</th>
                                    </tr>
                                </thead>
                                <tbody class="text-gray-800">
                                    ${processedRows.map((row, idx) => `
                                        <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors border-b border-gray-200">
                                            <td class="p-1.5 text-left font-bold border-r border-gray-200 text-blue-900 pl-4">${row.subject}</td>
                                            <td class="p-1 border-r border-gray-200 text-gray-500">${row.first}</td>
                                            <td class="p-1 border-r border-gray-200 text-gray-500">${row.mid}</td>
                                            <td class="p-1 border-r border-gray-200 text-gray-500">${row.final}</td>
                                            <td class="p-1 border-r border-gray-200 font-bold bg-blue-50/50">${row.totalObtained}</td>
                                            <td class="p-1 border-r border-gray-200 text-gray-500">${row.totalMax}</td>
                                            <td class="p-1 border-r border-gray-200 font-mono text-[10px]">${row.percentage}%</td>
                                            <td class="p-1 font-bold ${getGradeColor(row.grade)}">${row.grade}</td>
                                        </tr>
                                    `).join('')}
                                    <tr class="bg-gray-100 border-t-2 border-blue-900 font-bold">
                                        <td class="p-2 text-left text-blue-900 uppercase">Grand Total</td>
                                        <td class="p-1 border-r border-gray-300">-</td>
                                        <td class="p-1 border-r border-gray-300">-</td>
                                        <td class="p-1 border-r border-gray-300">-</td>
                                        <td class="p-1 border-r border-gray-300 text-sm bg-blue-100">${grandTotalObtained}</td>
                                        <td class="p-1 border-r border-gray-300 text-sm">${grandTotalMax}</td>
                                        <td class="p-1 border-r border-gray-300 text-sm text-blue-900">${overallPercentage}%</td>
                                        <td class="p-1 text-sm ${getGradeColor(overallGrade)}">${overallGrade}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Summary Footer -->
                        <div class="flex flex-col md:flex-row gap-4 mb-8 items-start">
                            <div class="w-full md:w-2/3">
                                <p class="font-bold text-xs text-gray-700 italic border-l-4 border-blue-900 pl-3 py-1 bg-gray-50 rounded-r-lg">
                                    "The beautiful thing about learning is that no one can take it away from you."
                                </p>
                            </div>
                            <div class="w-full md:w-1/3 border-2 border-blue-900 p-2 rounded-lg shadow-[3px_3px_0px_0px_rgba(30,58,138,1)]">
                                <h3 class="font-black text-center text-blue-900 border-b border-blue-900 pb-1 mb-2 uppercase tracking-wider text-xs">Final Verification</h3>
                                <div class="space-y-1 text-xs font-bold">
                                    <div class="flex justify-between">
                                        <span>Status:</span>
                                        <span class="${overallPercentage >= 40 ? 'text-green-600' : 'text-red-600'} uppercase">${overallPercentage >= 40 ? 'PASSED' : 'FAILED'}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Position:</span>
                                        <span>-</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Attendance:</span>
                                        <span>90%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Signatures -->
                        <div class="flex justify-between items-end mt-8 pt-4">
                            <div class="text-center w-32">
                                <div class="border-b-2 border-gray-800 mb-1"></div>
                                <p class="font-bold text-[10px] uppercase tracking-wider">Guardian Signature</p>
                            </div>
                            <div class="text-center w-32">
                                <div class="border-b-2 border-gray-800 mb-1"></div>
                                <p class="font-bold text-[10px] uppercase tracking-wider">Class Teacher</p>
                            </div>
                            <div class="text-center w-32">
                                <div class="border-b-2 border-gray-800 mb-1"></div>
                                <p class="font-bold text-[10px] uppercase tracking-wider">Principal</p>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="mt-4 text-center text-[10px] text-gray-400 font-mono">
                            <p>Generated on ${new Date().toLocaleDateString()} • This document is computer generated.</p>
                        </div>
                    </div>


                    <div class="fixed bottom-8 right-8 no-print">
                        <button onclick="window.print()" class="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 border-2 border-white">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print DMC
                        </button>
                    </div>

                    <script>
                        setTimeout(() => { window.print(); }, 1000);
                    </script>
                </body>
                </html>
            `;

            printWindow.document.write(html);
            printWindow.document.close();
            setLoading(false);
        } catch (error) {
            console.error('Error generating DMC:', error);
            alert('Failed to generate DMC');
            setLoading(false);
        }
    }

    // Helper for grade colors embedded in the string template above
    function getGradeColor(grade) {
        if (!grade) return 'text-gray-800';
        if (grade.includes('A')) return 'text-green-600';
        if (grade.includes('B')) return 'text-blue-600';
        if (grade.includes('C')) return 'text-yellow-600';
        if (grade.includes('D')) return 'text-orange-600';
        return 'text-red-600';
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'text-green-600 bg-green-100';
            case 'ongoing': return 'text-blue-600 bg-blue-100';
            case 'upcoming': return 'text-orange-600 bg-orange-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    }

    const filteredExams = exams.filter(exam => {
        const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.class?.name.toLowerCase().includes(searchQuery.toLowerCase());

        const status = exam.status?.toLowerCase();
        const matchesTab = activeTab === 'upcoming'
            ? (status === 'upcoming' || status === 'ongoing')
            : (status === 'completed');

        return matchesSearch && matchesTab;
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Exam Management
                        </h1>
                        <p className="text-gray-600 text-lg">Schedule exams, manage sessions, and monitor academic progress</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowAutoModal(true)}
                            className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold border-2 border-blue-600 shadow-md hover:bg-blue-50 transform hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faMagic} />
                            Auto Generate
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Schedule New Exam
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-96">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by exam title or class..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-2xl w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'completed' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                {/* Exams Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredExams.map((exam) => (
                            <div key={exam._id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-2 inline-block ${getStatusColor(exam.status)}`}>
                                                {exam.status}
                                            </span>
                                            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                {exam.title}
                                            </h3>
                                            <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                Class: {exam.class?.name} ({exam.class?.section}) • {exam.term}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditExam(exam)}
                                                className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteExam(exam._id)}
                                                className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        {(viewingFullExam === exam._id ? exam.sessions : exam.sessions.slice(0, 3)).map((session, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group/session hover:bg-white hover:shadow-md transition-all animate-fade-in">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800">{session.subject}</h4>
                                                        <p className="text-xs text-gray-500 flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400" />
                                                            {new Date(session.date).toLocaleDateString()}
                                                            <span className="mx-1">•</span>
                                                            <FontAwesomeIcon icon={faClock} className="text-purple-400" />
                                                            {session.startTime}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-gray-800">{session.totalMarks} Marks</p>
                                                    <p className="text-xs text-gray-400">{session.duration}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {exam.sessions.length > 3 && viewingFullExam !== exam._id && (
                                            <p
                                                onClick={() => setViewingFullExam(exam._id)}
                                                className="text-center text-sm font-bold text-blue-600 cursor-pointer hover:underline">
                                                + {exam.sessions.length - 3} more sessions
                                            </p>
                                        )}
                                        {viewingFullExam === exam._id && (
                                            <p
                                                onClick={() => setViewingFullExam(null)}
                                                className="text-center text-sm font-bold text-gray-400 cursor-pointer hover:underline">
                                                Show less
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setViewingFullExam(viewingFullExam === exam._id ? null : exam._id)}
                                            className="flex-1 bg-slate-900 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                            {viewingFullExam === exam._id ? 'Close Schedule' : 'View Full Schedule'}
                                            <FontAwesomeIcon icon={viewingFullExam === exam._id ? faTimes : faChevronRight} className="text-xs" />
                                        </button>
                                        <button
                                            onClick={() => handleManageResults(exam)}
                                            className="flex-1 bg-blue-50 text-blue-600 font-bold py-3.5 rounded-2xl hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
                                            <FontAwesomeIcon icon={faTrophy} />
                                            Manage Results
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Exam Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl relative z-10 overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white flex justify-between items-center flex-shrink-0">
                                <div>
                                    <h2 className="text-3xl font-bold">{editMode ? 'Edit Exam' : 'Schedule New Exam'}</h2>
                                    <p className="text-blue-100 text-sm">Create or update exam sessions</p>
                                </div>
                                <button onClick={() => { setShowModal(false); setEditMode(false); }} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50">
                                <form onSubmit={handleSaveExam} className="space-y-8">
                                    {/* Main Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Exam Title</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Mid-Term Examination"
                                                className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                value={newExam.title}
                                                onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Target Class</label>
                                            <select
                                                className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                value={newExam.class}
                                                onChange={(e) => setNewExam({ ...newExam, class: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Class</option>
                                                {classes.map(cls => (
                                                    <option key={cls._id} value={cls._id}>{cls.name} - {cls.section}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Term</label>
                                            <select
                                                className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                value={newExam.term}
                                                onChange={(e) => setNewExam({ ...newExam, term: e.target.value })}
                                            >
                                                <option value="First Term">First Term</option>
                                                <option value="Mid-Term">Mid-Term</option>
                                                <option value="Final Term">Final Term</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Sessions */}
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500" />
                                                Exam Sessions
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={handleAddSession}
                                                className="text-blue-600 font-bold hover:underline py-2 px-4 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                                Add Session
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            {newExam.sessions.map((session, index) => (
                                                <div key={index} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative group">
                                                    {newExam.sessions.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveSession(index)}
                                                            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} className="text-xs" />
                                                        </button>
                                                    )}
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                        <div>
                                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Subject</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Subject"
                                                                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                                                                value={session.subject}
                                                                onChange={(e) => handleSessionChange(index, 'subject', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Date</label>
                                                            <input
                                                                type="date"
                                                                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                                                                value={session.date}
                                                                onChange={(e) => handleSessionChange(index, 'date', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Time & Duration</label>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="time"
                                                                    className="w-full px-3 py-3 rounded-2xl bg-gray-50 border-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                                                                    value={session.startTime}
                                                                    onChange={(e) => handleSessionChange(index, 'startTime', e.target.value)}
                                                                    required
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Duration (e.g. 3h)"
                                                                    className="w-full px-3 py-3 rounded-2xl bg-gray-50 border-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                                                                    value={session.duration}
                                                                    onChange={(e) => handleSessionChange(index, 'duration', e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Room & Marks</label>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Room"
                                                                    className="w-full px-3 py-3 rounded-2xl bg-gray-50 border-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                                                                    value={session.room}
                                                                    onChange={(e) => handleSessionChange(index, 'room', e.target.value)}
                                                                />
                                                                <input
                                                                    type="number"
                                                                    placeholder="Marks"
                                                                    className="w-full px-3 py-3 rounded-2xl bg-gray-50 border-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                                                                    value={session.totalMarks}
                                                                    onChange={(e) => handleSessionChange(index, 'totalMarks', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 p-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-8 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                                        >
                                            Discard Changes
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-10 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                                        >
                                            Save Exam Schedule
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Auto Generate Modal */}
                {showAutoModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAutoModal(false)}></div>
                        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-fade-in flex flex-col">
                            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-bold">Auto Generate Schedules</h2>
                                    <p className="text-indigo-100 text-sm">Create schedules for all classes instantly</p>
                                </div>
                                <button onClick={() => setShowAutoModal(false)} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                                </button>
                            </div>

                            <form onSubmit={handleAutoGenerate} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Exam Title (for all classes)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Final Term Examination 2026"
                                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={autoExam.title}
                                            onChange={(e) => setAutoExam({ ...autoExam, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Term</label>
                                        <select
                                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={autoExam.term}
                                            onChange={(e) => setAutoExam({ ...autoExam, term: e.target.value })}
                                        >
                                            <option value="First Term">First Term</option>
                                            <option value="Mid-Term">Mid-Term</option>
                                            <option value="Final Term">Final Term</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">First Paper Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={autoExam.startDate}
                                            onChange={(e) => setAutoExam({ ...autoExam, startDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Start Time</label>
                                        <input
                                            type="time"
                                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={autoExam.startTime}
                                            onChange={(e) => setAutoExam({ ...autoExam, startTime: e.target.value })}
                                            required
                                        />
                                    </div>
                                    {/* Duration hidden as per user request, using default 3h in controller */}
                                </div>

                                <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-4">
                                    <FontAwesomeIcon icon={faExclamationCircle} className="text-blue-500 mt-1" />
                                    <p className="text-sm text-blue-700">
                                        This will automatically assign papers to all classes, avoiding teacher collisions and skipping Sundays. Results will be saved as new exam schedules.
                                    </p>
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAutoModal(false)}
                                        className="px-8 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-10 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faMagic} />
                                                Generate Now
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Manage Results Modal */}
                {showResultsModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowResultsModal(false)}></div>
                        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-7xl relative z-10 overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white flex justify-between items-center flex-shrink-0">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight">Manage Results</h2>
                                    <p className="text-emerald-50 text-sm font-medium">Exam: {marksData.exam?.title} • Class: {marksData.exam?.class?.name}</p>
                                </div>
                                <button onClick={() => setShowResultsModal(false)} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                                </button>
                            </div>

                            <div className="p-0 overflow-x-auto flex-1 bg-white">
                                <table className="w-full border-collapse">
                                    <thead className="sticky top-0 z-20 bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest border-b bg-slate-50 min-w-[200px] sticky left-0 z-30">Student Info</th>
                                            {marksData.exam?.sessions.map((session, sIdx) => (
                                                <th key={sIdx} className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-b bg-slate-50 min-w-[120px]">
                                                    {session.subject}
                                                    <span className="block text-[10px] text-slate-400 normal-case mt-1">(Max: {session.totalMarks})</span>
                                                </th>
                                            ))}
                                            <th className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-b bg-slate-50 min-w-[100px] sticky right-0 z-30">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {marksData.students.map((student) => (
                                            <tr key={student._id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                                    <p className="font-black text-slate-800">{student.FirstName} {student.LastName}</p>
                                                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Roll: {student.RollNo || 'N/A'}</p>
                                                </td>
                                                {marksData.exam?.sessions.map((session, sIdx) => (
                                                    <td key={sIdx} className="px-4 py-3 text-center">
                                                        <input
                                                            type="number"
                                                            placeholder="0"
                                                            className="w-20 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-center font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                                                            value={marksData.entry[student._id]?.[session.subject] || ''}
                                                            onChange={(e) => {
                                                                const newVal = e.target.value;
                                                                if (newVal === '' || (Number(newVal) >= 0 && Number(newVal) <= session.totalMarks)) {
                                                                    setMarksData(prev => ({
                                                                        ...prev,
                                                                        entry: {
                                                                            ...prev.entry,
                                                                            [student._id]: {
                                                                                ...prev.entry[student._id],
                                                                                [session.subject]: newVal
                                                                            }
                                                                        }
                                                                    }));
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                ))}
                                                <td className="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-slate-50/50 z-10 border-l border-slate-100 shadow-[-2px_0_5px_rgba(0,0,0,0.02)]">
                                                    <button
                                                        onClick={() => handleDownloadDMC(student)}
                                                        className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all mx-auto"
                                                        title="Download DMC"
                                                    >
                                                        <FontAwesomeIcon icon={faDownload} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                                <button
                                    onClick={() => setShowResultsModal(false)}
                                    className="px-8 py-3 rounded-2xl font-bold text-slate-500 hover:bg-gray-200 transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={handlePrintResults}
                                    className="px-8 py-3 rounded-2xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faPrint} />
                                    Print Results
                                </button>
                                <button
                                    onClick={handleSubmitResults}
                                    className="px-10 py-3 rounded-2xl font-bold bg-emerald-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                            Save Results
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExamManagement;
