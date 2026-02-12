import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faSearch,
    faFilter,
    faUser,
    faChalkboardTeacher,
    faUserGraduate,
    faUserShield,
    faEdit,
    faTrash,
    faEllipsisV,
    faEnvelope,
    faPhone,
    faTimes,
    faCheckCircle,
    faBan,
    faEllipsisVertical,
    faArrowUp
} from '@fortawesome/free-solid-svg-icons'

const AdminUsers = () => {
    const [showModal, setShowModal] = useState(false)
    const [selectedRole, setSelectedRole] = useState('all')
    const [selectedClass, setSelectedClass] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [activeMenuId, setActiveMenuId] = useState(null)

    // Mock Data
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    // Promotion System State
    const [selectedStudents, setSelectedStudents] = useState(new Set());
    const [showPromoteModal, setShowPromoteModal] = useState(false);
    const [targetClass, setTargetClass] = useState('');
    const [classes, setClasses] = useState([]);

    const fetchClasses = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/classes`);
            const data = await response.json();
            if (response.ok) {
                setClasses(data);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users`);
            const data = await response.json();
            if (response.ok && Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error('Expected an array of users, but got:', data);
                setUsers([]); // Reset to empty array on failure
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchClasses();
    }, []);

    const handleCheckboxChange = (studentId) => {
        const newSelected = new Set(selectedStudents);
        if (newSelected.has(studentId)) {
            newSelected.delete(studentId);
        } else {
            newSelected.add(studentId);
        }
        setSelectedStudents(newSelected);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allStudentIds = filteredUsers
                .filter(u => u.role === 'student' && u.details?._id)
                .map(u => u.details._id);
            setSelectedStudents(new Set(allStudentIds));
        } else {
            setSelectedStudents(new Set());
        }
    };

    const handlePromoteSubmit = async () => {
        if (!targetClass) {
            alert('Please select a target class');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/students/promote`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentIds: Array.from(selectedStudents),
                    targetClass
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                setShowPromoteModal(false);
                setSelectedStudents(new Set());
                setTargetClass('');
                fetchUsers(); // Refresh list to show new classes
            } else {
                alert(data.message || 'Failed to promote students');
            }
        } catch (error) {
            console.error('Error promoting students:', error);
            alert('Error promoting students');
        }
    };

    const openPromoteModal = (studentId = null) => {
        if (studentId) {
            setSelectedStudents(new Set([studentId]));
        }
        // If bulk (studentId is null), we use existing selectedStudents
        if (!studentId && selectedStudents.size === 0) {
            alert('Please select at least one student to promote');
            return;
        }
        setShowPromoteModal(true);
    };


    const handleStatusUpdate = async (userId, role, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, role })
            });
            fetchUsers();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: ''
    })

    // Edit User State
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [editFormData, setEditFormData] = useState({})

    const handleEditClick = (user) => {
        setEditingUser(user)
        setEditFormData({ ...user.details, email: user.email })
        setShowEditModal(true)
    }

    const handleUpdateUser = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData();
            Object.keys(editFormData).forEach(key => {
                if (key === 'profilePictureFile') {
                    formData.append('profilePicture', editFormData[key]);
                } else {
                    const value = editFormData[key];
                    // Only append simple values (string, number, boolean)
                    // Skip nested objects/arrays to avoid [object Object] corruption
                    if (value !== null && value !== undefined && typeof value !== 'object') {
                        formData.append(key, value);
                    } else if (key === 'DateOfBirth' && value) {
                        // Special case for Date string
                        formData.append(key, value);
                    }
                }
            });

            const response = await fetch(`${API_BASE_URL}/api/users/${editingUser.id}/details`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                setShowEditModal(false);
                fetchUsers();
            } else {
                alert('Failed to update user details');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user');
        }
    }

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    fetchUsers();
                } else {
                    alert('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user');
            }
        }
    }

    const handleCreateUser = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${API_BASE_URL}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                fetchUsers();
                setShowModal(false);
                setNewUser({
                    firstName: '',
                    lastName: '',
                    email: '',
                    username: '',
                    password: ''
                });
                // alert('Admin created successfully');
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to create admin');
            }
        } catch (error) {
            console.error('Error creating admin:', error);
            alert('Error creating admin');
        }
    }

    const handleGenerateCertificate = (type, user) => {
        const student = user.details;
        if (!student) return;

        const printWindow = window.open('', '_blank');
        const dateString = new Date().toLocaleDateString();

        let content = '';
        const baseStyle = `
            <style>
                body { font-family: 'Times New Roman', serif; padding: 50px; color: #333; line-height: 1.6; }
                .border-container { border: 15px double #1e3a8a; padding: 40px; position: relative; min-height: 80vh; }
                .header { text-align: center; margin-bottom: 50px; }
                .logo { font-size: 32px; font-weight: bold; color: #1e3a8a; text-transform: uppercase; margin-bottom: 5px; }
                .school-info { font-size: 14px; color: #666; font-style: italic; }
                .cert-title { font-size: 36px; font-weight: bold; color: #1e3a8a; text-align: center; margin: 40px 0; text-transform: uppercase; border-bottom: 2px solid #1e3a8a; display: inline-block; padding-bottom: 5px; }
                .content { font-size: 18px; margin-top: 40px; text-align: justify; }
                .field { font-weight: bold; color: #000; text-decoration: underline; border-bottom: 1px dotted #000; padding: 0 5px; }
                .footer { margin-top: 80px; display: flex; justify-content: space-between; align-items: flex-end; }
                .signature { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px; font-weight: bold; }
                @media print { .no-print { display: none; } }
            </style>
        `;

        switch (type) {
            case 'birth':
                content = `
                    <div class="border-container">
                        <div class="header">
                            <div class="logo">OKS Management System</div>
                            <div class="school-info">Excellence in Education</div>
                        </div>
                        <center><div class="cert-title">Birth Certificate</div></center>
                        <div class="content">
                            This is to certify that <span class="field">${student.FirstName} ${student.LastName}</span>, 
                            child of <span class="field">${student.FatherName || student.fatherName || student.GuardianName || 'N/A'}</span>, 
                            was born on <span class="field">${new Date(student.DateOfBirth || student.dateOfBirth).toLocaleDateString()}</span>.
                            As per school records, the gender of the child is registered as <span class="field">${student.Gender || 'N/A'}</span>.
                        </div>
                        <div class="footer">
                            <div>Date: ${dateString}</div>
                            <div class="signature">Principal Signature</div>
                        </div>
                    </div>
                `;
                break;
            case 'leaving':
                content = `
                    <div class="border-container">
                        <div class="header">
                            <div class="logo">OKS Management System</div>
                            <div class="school-info">Excellence in Education</div>
                        </div>
                        <center><div class="cert-title">School Leaving Certificate</div></center>
                        <div class="content">
                            Certified that <span class="field">${student.FirstName} ${student.LastName}</span>, 
                            carrying Roll No <span class="field">${student.RollNo || 'N/A'}</span>, 
                            has been a student of this school in <span class="field">Class ${student.CurrentClass || student.AdmissionClass || 'N/A'}</span>.
                            The student joined the institution on <span class="field">${new Date(student.AdmissionDate).toLocaleDateString()}</span>.
                            The character of the student during their stay has been <span class="field">Good</span>. 
                            The student is leaving the school on <span class="field">${dateString}</span> due to completion of studies/personal reasons.
                        </div>
                        <div class="footer">
                            <div>Date: ${dateString}</div>
                            <div class="signature">Principal Signature</div>
                        </div>
                    </div>
                `;
                break;
            case 'character':
                content = `
                    <div class="border-container">
                        <div class="header">
                            <div class="logo">OKS Management System</div>
                            <div class="school-info">Excellence in Education</div>
                        </div>
                        <center><div class="cert-title">Character Certificate</div></center>
                        <div class="content">
                            This is to certify that <span class="field">${student.FirstName} ${student.LastName}</span>, 
                            child of <span class="field">${student.FatherName || student.fatherName || student.GuardianName || 'N/A'}</span>, 
                            has been a student of our school since <span class="field">${new Date(student.AdmissionDate).toLocaleDateString()}</span>.
                            During their period of study, the student has demonstrated exemplary conduct and character. 
                            We found them to be diligent, hard-working, and respectful towards their peers and teachers.
                            We wish them the very best in all future endeavors.
                        </div>
                        <div class="footer">
                            <div>Date: ${dateString}</div>
                            <div class="signature">Principal Signature</div>
                        </div>
                    </div>
                `;
                break;
            case 'completion':
                content = `
                    <div class="border-container">
                        <div class="header">
                            <div class="logo">OKS Management System</div>
                            <div class="school-info">Excellence in Education</div>
                        </div>
                        <center><div class="cert-title">Course Completion Certificate</div></center>
                        <div class="content">
                            OKS Management System proudly presents this certificate to <span class="field">${student.FirstName} ${student.LastName}</span> 
                            in recognition of successful completion of <span class="field">Grade ${student.CurrentClass || 'N/A'}</span>.
                            The student has met all academic requirements and demonstrated proficient understanding of the subjects prescribed in the curriculum.
                        </div>
                        <div class="footer">
                            <div>Date: ${dateString}</div>
                            <div class="signature">Principal Signature</div>
                        </div>
                    </div>
                `;
                break;
            default: break;
        }

        printWindow.document.write(`
            <html>
                <head><title>${type.toUpperCase()} Certificate - ${student.FirstName}</title>${baseStyle}</head>
                <body>
                    <div class="no-print" style="text-align:center; padding: 20px;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #1e3a8a; color: white; border: none; cursor: pointer; border-radius: 5px;">Print Certificate</button>
                    </div>
                    ${content}
                </body>
            </html>
        `);
        printWindow.document.close();
    }

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return faUserShield
            case 'teacher': return faChalkboardTeacher
            case 'student': return faUserGraduate
            default: return faUser
        }
    }

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700'
            case 'teacher': return 'bg-blue-100 text-blue-700'
            case 'student': return 'bg-green-100 text-green-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesRole = selectedRole === 'all' || user.role === selectedRole
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const notWithdrawn = user.status !== 'withdrawn' // Exclude withdrawn students
        const matchesClass = selectedClass === 'all' || (() => {
            if (user.role !== 'student') return false;

            // 1. Direct ID match (checks if student.class is the ID or student.class._id is the ID)
            if (user.details?.class === selectedClass || user.details?.class?._id === selectedClass || user.details?.classId === selectedClass) {
                return true;
            }

            // 2. Legacy Name match
            // The dropdown gives us an ID (selectedClass). We need to find the name of that class.
            const selectedClassObj = classes.find(c => c._id === selectedClass);
            if (selectedClassObj && user.details?.CurrentClass) {
                return user.details.CurrentClass.trim().toLowerCase() === selectedClassObj.name.trim().toLowerCase();
            }

            return false;
        })();

        return matchesRole && matchesSearch && notWithdrawn && matchesClass
    })

    const withdrawnStudents = users.filter(user =>
        user.role === 'student' && user.status === 'withdrawn'
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        User Management
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Manage system access and user accounts
                    </p>
                </div>
                <div className="flex gap-4">
                    {selectedStudents.size > 0 && (
                        <button
                            onClick={() => openPromoteModal()}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center animate-fade-in"
                        >
                            <FontAwesomeIcon icon={faArrowUp} className="mr-2" />
                            Promote ({selectedStudents.size})
                        </button>
                    )}
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add Admin
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Users</p>
                            <h3 className="text-3xl font-bold text-gray-800">{users.length}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            <FontAwesomeIcon icon={faUser} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Teachers</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {users.filter(u => u.role === 'teacher').length}
                            </h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl text-green-600">
                            <FontAwesomeIcon icon={faChalkboardTeacher} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Students</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {users.filter(u => u.role === 'student').length}
                            </h3>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                            <FontAwesomeIcon icon={faUserGraduate} className="text-xl" />
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
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                <option value="student">Students</option>
                                <option value="teacher">Teachers</option>
                                <option value="admin">Admins</option>
                            </select>
                        </div>

                        {(selectedRole === 'all' || selectedRole === 'student') && (
                            <div className="relative">
                                <FontAwesomeIcon icon={faChalkboardTeacher} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 font-medium appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                >
                                    <option value="all">All Classes</option>
                                    {classes.map((cls) => (
                                        <option key={cls._id} value={cls._id}>
                                            {cls.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="relative w-full md:w-64">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        onChange={handleSelectAll}
                                        checked={filteredUsers.filter(u => u.role === 'student').length > 0 && selectedStudents.size === filteredUsers.filter(u => u.role === 'student').length}
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        {user.role === 'student' && (
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                checked={selectedStudents.has(user.details?._id)}
                                                onChange={() => handleCheckboxChange(user.details?._id)}
                                            />
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-500 mr-3 shadow-sm border border-gray-200">
                                                {user.role === 'student' && user.details?.profilePicture ? (
                                                    <img
                                                        src={`${API_BASE_URL}/uploads/${user.details.profilePicture}`}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FontAwesomeIcon icon={getRoleIcon(user.role)} />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user._id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${user.status === 'active' || user.status === 'approved'
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : user.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                : user.status === 'withdrawn'
                                                    ? 'bg-gray-100 text-gray-500 border border-gray-200'
                                                    : 'bg-red-100 text-red-700 border border-red-200'
                                            }`}>
                                            <FontAwesomeIcon
                                                icon={
                                                    user.status === 'active' || user.status === 'approved' ? faCheckCircle :
                                                        user.status === 'pending' ? faEnvelope :
                                                            user.status === 'withdrawn' ? faBan : faTimes
                                                }
                                                className={`mr-1.5 ${user.status === 'pending' ? 'animate-pulse' : ''
                                                    }`}
                                            />
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {user.joinDate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center gap-3">
                                            {user.role === 'teacher' && (
                                                <>
                                                    {(user.status === 'pending' || user.status === 'rejected') && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(user.id, user.role, 'approved')}
                                                            className="w-9 h-9 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-sm border border-green-100"
                                                            title="Approve Teacher"
                                                        >
                                                            <FontAwesomeIcon icon={faCheckCircle} className="text-sm" />
                                                        </button>
                                                    )}
                                                    {(user.status === 'pending' || user.status === 'approved') && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(user.id, user.role, 'rejected')}
                                                            className="w-9 h-9 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-sm border border-red-100"
                                                            title="Reject Teacher"
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} className="text-sm" />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-sm border border-blue-100"
                                                title="Edit User"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="text-sm" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-sm border border-rose-100"
                                                title="Delete User"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                            </button>

                                            {user.role === 'student' && (
                                                <div className="relative flex items-center gap-2">
                                                    <button
                                                        onClick={() => openPromoteModal(user.details?._id)}
                                                        className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-sm border border-orange-100"
                                                        title="Promote Student"
                                                    >
                                                        <FontAwesomeIcon icon={faArrowUp} className="text-sm" />
                                                    </button>

                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                                                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm border ${activeMenuId === user.id
                                                                ? 'bg-gray-200 text-gray-800 scale-110'
                                                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                                                }`}
                                                            title="More Actions"
                                                        >
                                                            <FontAwesomeIcon icon={faEllipsisVertical} />
                                                        </button>

                                                        {activeMenuId === user.id && (
                                                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-fade-in origin-top-right">
                                                                {/* Status Actions */}
                                                                {user.status !== 'withdrawn' && (
                                                                    <>
                                                                        <div className="px-4 py-2 border-bottom border-gray-50 mb-2">
                                                                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Student Actions</p>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => {
                                                                                if (window.confirm('Are you sure you want to withdraw this student?')) {
                                                                                    handleStatusUpdate(user.id, user.role, 'withdrawn');
                                                                                    setActiveMenuId(null);
                                                                                }
                                                                            }}
                                                                            className="w-full px-5 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 font-medium"
                                                                        >
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                                                            Withdraw Student
                                                                        </button>
                                                                        <div className="my-2 border-t border-gray-100"></div>
                                                                    </>
                                                                )}

                                                                {/* Certificates */}
                                                                <div className="px-4 py-2 border-bottom border-gray-50 mb-2">
                                                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Generate Certificates</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => { handleGenerateCertificate('birth', user); setActiveMenuId(null); }}
                                                                    className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-3"
                                                                >
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                                                    Birth Certificate
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Withdrawn Students Section */}
            {withdrawnStudents.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mt-8">
                    <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-700">Withdrawn Students</h2>
                                <p className="text-sm text-gray-500">Students who have withdrawn from the institution</p>
                            </div>
                            <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-bold text-sm">
                                {withdrawnStudents.length} Student{withdrawnStudents.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Withdrawn Date</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {withdrawnStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors opacity-75">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400 mr-3 shadow-sm border border-gray-200">
                                                    {student.details?.profilePicture ? (
                                                        <img
                                                            src={`${API_BASE_URL}/uploads/${student.details.profilePicture}`}
                                                            alt={student.name}
                                                            className="w-full h-full object-cover opacity-75"
                                                        />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faUserGraduate} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-700">{student.name}</div>
                                                    <div className="text-xs text-gray-500">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {student.details?.withdrawnDate
                                                ? new Date(student.details.withdrawnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                : 'N/A'
                                            }
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => handleEditClick(student)}
                                                className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-sm border border-blue-100 mx-auto"
                                                title="View Details"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="text-sm" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Promote Student Modal */}
            {showPromoteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Promote Student(s)</h2>
                            <button
                                onClick={() => setShowPromoteModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <p className="text-gray-600">
                                You are about to promote <span className="font-bold text-gray-800">{selectedStudents.size}</span> student(s).
                                Please select the target class.
                            </p>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Class</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer"
                                    value={targetClass}
                                    onChange={(e) => setTargetClass(e.target.value)}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map((cls) => (
                                        <option key={cls._id} value={cls.name}>
                                            {cls.name} {cls.section ? `(${cls.section})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    onClick={() => setShowPromoteModal(false)}
                                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePromoteSubmit}
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    Confirm Promotion
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Admin Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Add New Admin</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newUser.firstName}
                                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newUser.lastName}
                                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newUser.username}
                                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </div>
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
                                    Create Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Edit User Modal */}
            {showEditModal && editingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center sticky top-0 z-10">
                            <h2 className="text-2xl font-bold text-white">Edit User: {editingUser.name}</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateUser} className="p-8 space-y-6">

                            {/* Common Fields - Only show for non-students as per user request to strictly limit student fields */}
                            {editingUser.role !== 'student' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={editFormData.FatherName || editFormData.fatherName || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, FatherName: e.target.value })} />
                                </div>
                            )}

                            {/* Student Specific Fields - Exactly 13 fields */}
                            {editingUser.role === 'student' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Roll No</label>
                                        <input type="number" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.RollNo || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, RollNo: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                            <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                                value={editFormData.FirstName || ''}
                                                onChange={(e) => setEditFormData({ ...editFormData, FirstName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                            <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                                value={editFormData.LastName || ''}
                                                onChange={(e) => setEditFormData({ ...editFormData, LastName: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                                        <input type="date" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.DateOfBirth ? new Date(editFormData.DateOfBirth).toISOString().split('T')[0] : ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, DateOfBirth: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Religion</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.Religion || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, Religion: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">CNIC</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.CNIC || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, CNIC: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Father Occupation</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.FatherOccupation || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, FatherOccupation: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Present Address</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.PresentAddress || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, PresentAddress: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Guardian Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.GuardianName || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, GuardianName: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Guardian Contact No</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.GuardianContactNo || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, GuardianContactNo: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Relation</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.Relation || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, Relation: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.section || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, section: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Guardian Present Address</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.GuardianPresentAddress || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, GuardianPresentAddress: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture</label>
                                        <input type="file" accept="image/*" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-dash border-gray-300"
                                            onChange={(e) => setEditFormData({ ...editFormData, profilePictureFile: e.target.files[0] })} />
                                        <p className="text-xs text-gray-400 mt-1">Upload student's profile picture (Admin only)</p>
                                    </div>
                                </div>
                            )}

                            {/* Teacher Specific Fields */}
                            {editingUser.role === 'teacher' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.firstName || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.lastName || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Father's Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.fatherName || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, fatherName: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Major</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.subjectMajor || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, subjectMajor: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Total Experience (Years)</label>
                                        <input type="number" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                                            value={editFormData.totalExperience || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, totalExperience: e.target.value })} />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminUsers
