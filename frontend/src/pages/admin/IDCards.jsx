import React, { useState, useEffect, useRef } from 'react'
import { API_BASE_URL } from '../../apiConfig';
import logo from '../../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faIdCard,
    faSearch,
    faFilter,
    faPrint,
    faUsers,
    faChevronRight,
    faCheckCircle,
    faQrcode
} from '@fortawesome/free-solid-svg-icons'

const IDCards = () => {
    const [students, setStudents] = useState([])
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedClass, setSelectedClass] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStudents, setSelectedStudents] = useState([])

    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        try {
            setLoading(true)
            const [studentsRes, classesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/students`),
                fetch(`${API_BASE_URL}/api/classes`)
            ])
            const studentsData = await studentsRes.json()
            const classesData = await classesRes.json()

            setStudents(studentsData)
            setClasses(classesData)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredStudents = students.filter(student => {
        // Handle different class property names (standardized to use _id or name consistently would be better, but working with what we have)
        // Adjust this logic to match how students are returned from API and how classes are structured
        const studentClassId = student.class?._id || student.classId || student.class // Assuming populated or ID

        let matchesClass = true;
        if (selectedClass) {
            matchesClass = (() => {
                // 1. Direct ID Match
                if (student.class && typeof student.class === 'object') {
                    if (student.class._id === selectedClass) return true;
                } else {
                    if (student.class === selectedClass) return true;
                }

                // 2. Legacy Name Match
                const selectedClassObj = classes.find(c => c._id === selectedClass);
                if (selectedClassObj) {
                    const studentClassName = student.class?.name || student.CurrentClass || student.AdmissionClass;
                    if (studentClassName && studentClassName.trim().toLowerCase() === selectedClassObj.name.trim().toLowerCase()) {
                        return true;
                    }
                }

                return false;
            })();
        }

        const fullName = `${student.FirstName} ${student.LastName}`.toLowerCase()
        const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
            (student.RollNo && student.RollNo.toString().includes(searchQuery))
        return matchesClass && matchesSearch
    })

    const toggleStudentSelection = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(selectedStudents.filter(id => id !== studentId))
        } else {
            setSelectedStudents([...selectedStudents, studentId])
        }
    }

    const selectAllFiltered = () => {
        const filteredIds = filteredStudents.map(s => s._id)
        if (selectedStudents.length === filteredIds.length) {
            setSelectedStudents([])
        } else {
            setSelectedStudents(filteredIds)
        }
    }

    const handlePrintLinks = () => {
        const studentsToPrint = students.filter(s => selectedStudents.includes(s._id))
        if (studentsToPrint.length === 0) return

        const printWindow = window.open('', '_blank')

        const styles = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
                
                body {
                    font-family: 'Outfit', sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: #f0f2f5;
                }

                .id-card-container {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 40px;
                    justify-items: center;
                }

                .card {
                    width: 3.375in;
                    height: 2.125in;
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    position: relative;
                    display: flex;
                    page-break-inside: avoid;
                    border: none;
                }

                .card-front {
                    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                }

                .header {
                    padding: 8px 12px;
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.05);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .school-logo {
                    width: 35px;
                    height: 35px;
                    background: white;
                    border-radius: 8px;
                    margin-right: 10px;
                    padding: 2px;
                    object-fit: contain;
                }

                .school-info {
                    display: flex;
                    flex-direction: column;
                }

                .school-name {
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #fbbf24;
                }

                .school-meta {
                    font-size: 7px;
                    opacity: 0.8;
                    font-weight: 500;
                }

                .card-body {
                    flex: 1;
                    display: flex;
                    padding: 12px;
                    gap: 15px;
                    align-items: center;
                }

                .photo-area {
                    width: 75px;
                    height: 90px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                    border: 2px solid rgba(255,255,255,0.2);
                    overflow: hidden;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                }

                .photo-area img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .details {
                    flex: 1;
                }

                .id-label {
                    font-size: 6px;
                    text-transform: uppercase;
                    opacity: 0.6;
                    font-weight: 700;
                    letter-spacing: 0.3px;
                }

                .id-value {
                    font-size: 10px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }

                .student-name {
                    font-size: 13px;
                    font-weight: 800;
                    margin-bottom: 6px;
                    color: #fff;
                    text-transform: uppercase;
                }

                .footer-bar {
                    height: 6px;
                    background: #fbbf24;
                }

                .card-back {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 15px;
                    text-align: center;
                    background: #fff;
                    color: #1f2937;
                    width: 100%;
                }

                .qr-code {
                    width: 80px;
                    height: 80px;
                    margin-bottom: 8px;
                    padding: 5px;
                    border: 1px solid #f3f4f6;
                    border-radius: 8px;
                }

                .qr-code img {
                    width: 100%;
                    height: 100%;
                }

                .back-title {
                    font-size: 9px;
                    font-weight: 800;
                    margin-bottom: 5px;
                    color: #1e3a8a;
                    text-transform: uppercase;
                }

                .back-info {
                    font-size: 8px;
                    line-height: 1.5;
                    color: #4b5563;
                }

                @media print {
                    body { background: white; padding: 0; }
                    .id-card-container { gap: 15px; }
                    .no-print { display: none; }
                }
            </style>
        `

        let cardsHtml = ''
        studentsToPrint.forEach(student => {
            const fullName = `${student.FirstName} ${student.LastName}`
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${student._id}`
            const photoUrl = student.profilePicture ? `${API_BASE_URL}/uploads/${student.profilePicture}` : `https://ui-avatars.com/api/?name=${student.FirstName}+${student.LastName}&background=random`

            cardsHtml += `
                <div class="card">
                    <div class="card-front">
                        <div class="header">
                            <img src="${logo}" class="school-logo" alt="Logo">
                            <div class="school-info">
                                <span class="school-name">The Ocean of Knowledge School</span>
                                <span class="school-meta">Kot Charbagh Swat | 03462064044</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="photo-area">
                                <img src="${photoUrl}" alt="Student">
                            </div>
                            <div class="details">
                                <div class="id-label">Student Name</div>
                                <div class="student-name">${fullName}</div>
                                
                                <div style="display: flex; gap: 15px;">
                                    <div>
                                        <div class="id-label">Roll No</div>
                                        <div class="id-value">${student.RollNo || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div class="id-label">Class</div>
                                        <div class="id-value">${student.class?.name || student.CurrentClass || student.AdmissionClass || 'N/A'}</div>
                                    </div>
                                </div>
                                <div class="id-label">Parent/Guardian</div>
                                <div class="id-value">${student.GuardianName || 'Electronic Record'}</div>
                            </div>
                        </div>
                        <div class="footer-bar"></div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-back">
                        <div class="back-title">STUDENT IDENTITY CARD</div>
                        <div class="qr-code">
                            <img src="${qrUrl}" alt="QR Code">
                        </div>
                        <div class="back-info">
                            This card is the property of OKS Management System.<br>
                            If found, please return to the school office.<br>
                            <strong>Student ID: #${student._id}</strong>
                        </div>
                        <div style="margin-top: 10px; font-size: 7px; color: #9ca3af;">
                            System Generated ID - Scan for Attendance
                        </div>
                    </div>
                </div>
            `
        })

        printWindow.document.write(`
            <html>
                <head>
                    <title>Print ID Cards</title>
                    ${styles}
                </head>
                <body>
                    <div class="no-print" style="margin-bottom: 20px; text-align: center;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #1e3a8a; color: white; border: none; cursor: pointer; border-radius: 8px; font-weight: bold;">
                            Start Printing
                        </button>
                    </div>
                    <div class="id-card-container">
                        ${cardsHtml}
                    </div>
                </body>
            </html>
        `)
        printWindow.document.close()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <FontAwesomeIcon icon={faIdCard} className="text-primary" />
                        ID Card Generation
                    </h1>
                    <p className="text-gray-500 mt-1">Generate and print professional, QR-enabled ID cards for students.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrintLinks}
                        disabled={selectedStudents.length === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${selectedStudents.length > 0
                            ? 'bg-primary text-blue hover:scale-105 hover:shadow-xl active:scale-95'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <FontAwesomeIcon icon={faPrint} />
                        Print {selectedStudents.length} Cards
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faFilter} className="text-primary text-sm" />
                            Filters
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Select Class</label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">All Classes</option>
                                    {classes.map(c => (
                                        <option key={c._id} value={c._id}>{c.name} {c.section}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Search Student</label>
                                <div className="relative">
                                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Name or Roll No..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary to-blue-700 p-6 rounded-3xl shadow-xl text-white">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                            <FontAwesomeIcon icon={faQrcode} />
                            Attendance Ready
                        </h4>
                        <p className="text-sm text-blue-100 leading-relaxed mb-4">
                            Each ID card includes a unique QR code. You can use any barcode/QR scanner to mark attendance automatically in the future.
                        </p>
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-semibold opacity-80">Selected</span>
                                <span className="text-xl font-bold">{selectedStudents.length}</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-yellow-400 h-full transition-all duration-500"
                                    style={{ width: `${(selectedStudents.length / (filteredStudents.length || 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <FontAwesomeIcon icon={faUsers} className="text-primary" />
                                Student Portal Records
                                <span className="text-xs font-normal text-gray-500 ml-2">({filteredStudents.length} found)</span>
                            </h3>
                            <button
                                onClick={selectAllFiltered}
                                className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
                            >
                                <FontAwesomeIcon icon={faCheckCircle} />
                                {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-gray-600 text-sm">Select</th>
                                        <th className="px-6 py-4 font-bold text-gray-600 text-sm">Student</th>
                                        <th className="px-6 py-4 font-bold text-gray-600 text-sm">Class & Roll</th>
                                        <th className="px-6 py-4 font-bold text-gray-600 text-sm text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <tr key={student._id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedStudents.includes(student._id)}
                                                        onChange={() => toggleStudentSelection(student._id)}
                                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                                            {student.profilePicture ? (
                                                                <img src={`${API_BASE_URL}/uploads/${student.profilePicture}`} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <FontAwesomeIcon icon={faIdCard} className="text-gray-400 text-sm" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-800 group-hover:text-primary transition-colors">
                                                                {student.FirstName} {student.LastName}
                                                            </div>
                                                            <div className="text-xs text-gray-500">ID: #{student._id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-700">Class {student.class?.name || student.CurrentClass || student.AdmissionClass || 'N/A'}</div>
                                                    <div className="text-xs text-gray-500">Roll No: {student.RollNo || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStudents([student._id])
                                                            handlePrintLinks()
                                                        }}
                                                        className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"
                                                        title="Quick Print"
                                                    >
                                                        <FontAwesomeIcon icon={faChevronRight} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center">
                                                    <FontAwesomeIcon icon={faSearch} className="text-4xl text-gray-200 mb-3" />
                                                    <p className="font-medium text-lg text-gray-400">No students found matching filters.</p>
                                                    <p className="text-sm">Try adjust your search or class filter.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IDCards
