import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faSearch,
    faFilter,
    faUserGraduate,
    faCheckCircle,
    faTimesCircle,
    faClock,
    faFileAlt,
    faEllipsisV,
    faEnvelope,
    faPhone,
    faTimes,
    faSave,
    faTrash,
    faCheck,
    faBan,
    faPrint
} from '@fortawesome/free-solid-svg-icons'
import schoolLogo from '../../assets/logo.png'

const AdminAdmissions = () => {
    const [showModal, setShowModal] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)

    // New Application Form State
    const [newApplication, setNewApplication] = useState({
        firstName: '',
        lastName: '',
        studentName: '', // Kept for backend compatibility, will be constructed on submit
        fatherName: '', // treating as Parent Name
        admissionClass: '', // changed from 'class' to match schema
        dateOfBirth: '',
        previousSchool: '',
        guardianContact: '', // treating as Phone
        guardianEmail: '', // treating as Email
        guardianAddress: '', // treating as Address
        guardianCNIC: '',
        fatherOccupation: '',
        // Default required fields for schema
        fatherAddress: 'N/A',
        fatherCNIC: 'N/A',
        guardianName: 'N/A',
        guardianRelation: 'N/A',
    })

    const fetchApplications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admissions`)
            const data = await response.json()
            if (response.ok) {
                setApplications(data)
            } else {
                console.error('Failed to fetch admissions:', data.message)
            }
        } catch (error) {
            console.error('Error fetching admissions:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [])

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admissions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            })

            if (response.ok) {
                const updatedApp = await response.json()
                setApplications(applications.map(app =>
                    app._id === id ? updatedApp : app
                ))
            } else {
                const errorData = await response.json();
                alert(`Failed to update status: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Error updating status')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return

        try {
            const response = await fetch(`${API_BASE_URL}/api/admissions/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setApplications(applications.filter(app => app._id !== id))
            } else {
                alert('Failed to delete application')
            }
        } catch (error) {
            console.error('Error deleting application:', error)
            alert('Error deleting application')
        }
    }


    const formatCNIC = (value) => {
        // Remove non-digits
        const numbers = value.replace(/\D/g, '');

        let formatted = '';
        if (numbers.length > 0) {
            formatted += numbers.substring(0, 5);
        }
        if (numbers.length > 5) {
            formatted += '-' + numbers.substring(5, 12);
        }
        if (numbers.length > 12) {
            formatted += '-' + numbers.substring(12, 13);
        }
        return formatted;
    }

    const handleCNICChange = (e) => {
        const val = e.target.value;
        if (val.length <= 15) { // 13 digits + 2 hyphens
            const formatted = formatCNIC(val);
            setNewApplication({ ...newApplication, guardianCNIC: formatted });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Prepare data to match schema expectations
        // We use the simplified modal form to fill required schema fields
        const submissionData = {
            ...newApplication,
            studentName: `${newApplication.firstName} ${newApplication.lastName}`.trim(),
            fatherOccupation: newApplication.fatherOccupation,
            // Fallbacks for required fields not in simplified admin form
            fatherAddress: newApplication.fatherAddress !== 'N/A' ? newApplication.fatherAddress : newApplication.guardianAddress,
            fatherCNIC: newApplication.fatherCNIC !== 'N/A' ? newApplication.fatherCNIC : 'Provided by Admin',
            guardianName: newApplication.guardianName !== 'N/A' ? newApplication.guardianName : newApplication.fatherName,
            guardianRelation: newApplication.guardianRelation !== 'N/A' ? newApplication.guardianRelation : 'Parent',
            guardianCNIC: newApplication.guardianCNIC,
            declarationAccepted: true
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/admissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            })

            if (response.ok) {
                const savedApp = await response.json()
                setApplications([savedApp, ...applications])
                setShowModal(false)
                setNewApplication({
                    firstName: '',
                    lastName: '',
                    studentName: '',
                    fatherName: '',
                    admissionClass: '',
                    dateOfBirth: '',
                    previousSchool: '',
                    guardianContact: '',
                    guardianEmail: '',
                    guardianAddress: '',
                    guardianCNIC: '',
                    fatherOccupation: '',
                    fatherAddress: 'N/A',
                    fatherCNIC: 'N/A',
                    guardianName: 'N/A',
                    guardianRelation: 'N/A',
                })
            } else {
                const data = await response.json()
                alert(`Failed to create admission: ${data.message}`)
            }
        } catch (error) {
            console.error('Error creating admission:', error)
            alert('Error creating admission')
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200'
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200'
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const handlePrint = (app) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups to print the admission form');
            return;
        }

        const studentFullName = `${app.FirstName || ''} ${app.LastName || ''}`.trim();
        const formattedDate = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
        const dob = app.DateOfBirth ? new Date(app.DateOfBirth).toLocaleDateString() : '———';
        const logoUrl = window.location.origin + schoolLogo;

        printWindow.document.open();
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <title>Admission Form - ${studentFullName}</title>

            <style>
                @page {
                    size: A4;
                    margin: 0;
                }
                body{
                    font-family: "Times New Roman", serif;
                    background:#f4f4f4;
                    padding:20px;
                    -webkit-print-color-adjust: exact;
                }

                .form-wrapper{
                    background:#fff;
                    max-width:900px;
                    margin:auto;
                    border:2px solid #000;
                    padding:25px 35px;
                    position:relative;
                }

                .header{
                    display: flex;
                    margin-bottom:15px;
                }

                .header img.logo{
                    width:110px;
                    height: auto;
                }

                .header-details{
                    text-align: center;
                    width: 100%;
                }

                .image-container{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .photo{
                    width:120px;
                    height:140px;
                    border:1px solid #000;
                    object-fit:cover;
                    background: #eee;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-size: 10px;
                }

                .title{
                    font-size:22px;
                    font-weight:bold;
                    margin-top:5px;
                }

                .sub{
                    font-size:16px;
                }

                .section-title{
                    margin-top:10px; 
                    font-weight:bold;
                    font-size:17px;
                    text-decoration:underline;
                }

                .row{
                    display:flex;
                    gap:25px;
                    margin:4px 0; 
                }

                .field{
                    flex:1;
                    font-size:15px;
                    padding: 5px 0; 
                }

                .label{
                    font-weight:bold;
                }

                .declaration{
                    margin-top:15px;
                    font-size:13px; 
                    line-height:1.4;
                }

                .sign-row{
                    display:flex;
                    justify-content:space-between;
                    margin-top:40px; 
                }

                .sign{
                    text-align:center;
                    font-size:14px;
                }

                .note-line{
                    border-top:1px solid #000;
                    width:180px;
                    margin:auto;
                    margin-bottom:3px;
                }

                @media print {
                    body {
                        background: white;
                        padding: 0;
                        margin: 0;
                    }
                    .form-wrapper {
                        border: none;
                        max-width: 100%;
                        padding: 10mm; /* Ensure content fits within safe area */
                        margin: 0;
                        transform: scale(0.98); /* Slight scale to ensure fit */
                        transform-origin: top left;
                    }
                }
            </style>
            </head>

            <body>

            <div class="form-wrapper">

                <div class="header">
                    <img src="${logoUrl}" class="logo" alt="School Logo" />
                    <div class="header-details">
                        <div class="title">THE OCEAN OF KNOWLEDGE SCHOOL</div>
                        <div class="sub">KOT, CHARBAGH SWAT</div>
                        <div>Phone : 034626046044 &nbsp;&nbsp; www.portal.studentcare.pk</div>
                    </div>
                </div>

                <div class="image-container">
                    <div class="">
                        <div class="field"><span class="label">Admission Form/Reg No: </span>${app._id.toString().slice(-6).toUpperCase()}</div>
                        <div class="field"><span class="label">Admission Date: </span>${formattedDate}</div>
                    </div>
                    
                    <!-- Placeholder Photo -->
                    <div class="photo">Student Photo</div>
                </div>
                
                <div class="section-title">STUDENT PROFILE</div>

                <div class="row">
                    <div class="field"><span class="label">Name of student:</span> ${studentFullName}</div>
                    <div class="field"><span class="label">Father Name:</span> ${app.fatherName || '———'}</div>
                </div>

                <div class="row">
                    <div class="field"><span class="label">Admission sought for Class:</span> ${app.AdmissionClass || app.CurrentClass || '———'}</div>
                    <div class="field"><span class="label">Admission Date:</span> ${formattedDate}</div>
                </div>

                <div class="row">
                    <div class="field"><span class="label">Date of Birth:</span> ${dob}</div>
                    <div class="field"><span class="label">Religion:</span> ${app.Religion || 'Islam'}</div>
                </div>

                <div class="row">
                    <div class="field"><span class="label">Blood Group:</span> ${app.bloodGroup || '———'}</div>
                    <div class="field"><span class="label">Form-B:</span> Nil</div>
                </div>

                <div class="row">
                    <div class="field"><span class="label">Father occupation:</span> ${app.FatherOccupation || '———'}</div>
                </div>

                <div class="row">
                    <div class="field"><span class="label">Present Address:</span> ${app.PresentAddress || '———'}</div>
                </div>



                <div class="section-title">GUARDIAN PROFILE</div>

                <div class="row">
                    <div class="field"><span class="label">Name of Guardian:</span> ${app.GuardianName || app.fatherName || '———'}</div>
                    <div class="field"><span class="label">Guardian CNIC:</span> ${app.CNIC || app.guardianCNIC || '———————————'}</div>
                </div>

                <div class="row">
                    <div class="field"><span class="label">Contact No:</span> ${app.GuardianContactNo || app.guardianContact || '———'}</div>
                    <div class="field"><span class="label">Relation:</span> ${app.Relation || 'Parent'}</div>
                </div>

                <div class="row">
                    <div class="field"><span class="label">Guardian Occupation:</span> ${app.guardianOccupation || '———————————'}</div>
                </div>

                <div class="row">
                    <div class="field"><span class="label">Present Address:</span> ${app.GuardianPresentAddress || app.guardianAddress || '——————————————————————————————'}</div>
                </div>



                <div class="section-title">Declaration:</div>

                <div class="declaration">
                    I, <b>${app.GuardianName || app.fatherName}</b>, the Father/Guardian of <b>${studentFullName}</b>, hereby solemnly declare that the particulars that I
                    provide to the institution in the Admission Form are correct and true to the best of my knowledge and belief.
                    In case of any incorrect or false information, I understand that I will be held responsible and liable for
                    any consequences. I also agree to abide by the decision of the management and follow all the school/college rules
                    and procedures. I will ensure that my son/daughter will also comply with the same and respect the authority of the institution.
                </div>

                <div class="sign-row">
                    <div class="sign">
                        <div class="note-line"></div>
                        Father/Guardian
                    </div>

                    <div class="sign">
                        <div class="note-line"></div>
                        Principal
                    </div>
                </div>

            </div>
            <script>
                window.onload = function() { window.print(); window.close(); }
            </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    const filteredApplications = (applications || []).filter(app => {
        const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus
        const studentName = `${app.FirstName || ''} ${app.LastName || ''}`.trim()
        const fatherName = app.fatherName || ''
        const matchesSearch = studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fatherName.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Admissions
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Manage student enrollment and applications
                    </p>
                </div>

            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Applications</p>
                            <h3 className="text-3xl font-bold text-gray-800">{applications.length}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            <FontAwesomeIcon icon={faFileAlt} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Pending Review</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {applications.filter(a => a.status === 'pending').length}
                            </h3>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
                            <FontAwesomeIcon icon={faClock} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Approved</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {applications.filter(a => a.status === 'approved').length}
                            </h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl text-green-600">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative">
                            <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 font-medium appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div className="relative w-full md:w-64">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Applicant</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Class</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Parent Details</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">Loading applications...</td>
                                </tr>
                            ) : filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">No applications found.</td>
                                </tr>
                            ) : (
                                filteredApplications.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                                    {app.FirstName?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{`${app.FirstName || ''} ${app.LastName || ''}`.trim() || 'N/A'}</div>
                                                    <div className="text-xs text-gray-500">{app.previousSchool || 'OKS Student'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                            {app.AdmissionClass || app.CurrentClass}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">{app.fatherName}</div>
                                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                                <FontAwesomeIcon icon={faPhone} className="mr-1" />
                                                {app.GuardianContactNo || app.guardianContact}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex justify-center space-x-2">
                                                {/* Approve Button */}
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'approved')}
                                                    className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition-colors"
                                                    title="Approve"
                                                >
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </button>
                                                {/* Reject Button */}
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                    className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors"
                                                    title="Reject"
                                                >
                                                    <FontAwesomeIcon icon={faBan} />
                                                </button>
                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(app._id)}
                                                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                                    title="Delete"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                                {/* Print Button */}
                                                <button
                                                    onClick={() => handlePrint(app)}
                                                    className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors"
                                                    title="Print Form"
                                                >
                                                    <FontAwesomeIcon icon={faPrint} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Admission Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center sticky top-0 z-10">
                            <h2 className="text-2xl font-bold text-white">New Admission</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.firstName}
                                        onChange={(e) => setNewApplication({ ...newApplication, firstName: e.target.value })}
                                        placeholder="First Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.lastName}
                                        onChange={(e) => setNewApplication({ ...newApplication, lastName: e.target.value })}
                                        placeholder="Last Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.dateOfBirth}
                                        onChange={(e) => setNewApplication({ ...newApplication, dateOfBirth: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Class Applying For</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.admissionClass}
                                        onChange={(e) => setNewApplication({ ...newApplication, admissionClass: e.target.value })}
                                    >
                                        <option value="">Select Class</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Previous School</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.previousSchool}
                                        onChange={(e) => setNewApplication({ ...newApplication, previousSchool: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Parent Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.fatherName}
                                        onChange={(e) => setNewApplication({ ...newApplication, fatherName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Father Occupation</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.fatherOccupation}
                                        onChange={(e) => setNewApplication({ ...newApplication, fatherOccupation: e.target.value })}
                                        placeholder="Occupation"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.guardianContact}
                                        onChange={(e) => setNewApplication({ ...newApplication, guardianContact: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Guardian CNIC</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="12345-1234567-8"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newApplication.guardianCNIC}
                                        onChange={handleCNICChange}
                                        maxLength="15"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={newApplication.guardianEmail}
                                    onChange={(e) => setNewApplication({ ...newApplication, guardianEmail: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                    value={newApplication.guardianAddress}
                                    onChange={(e) => setNewApplication({ ...newApplication, guardianAddress: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminAdmissions
