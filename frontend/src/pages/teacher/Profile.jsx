import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChalkboardTeacher,
    faUserTie,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faGraduationCap,
    faUserCheck,
    faBriefcase,
    faBookOpen,
    faIdCard,
    faUniversity,
    faSchool
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

const TeacherProfile = () => {
    const { user, loading: authLoading } = useAuth();
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeacherProfile = async () => {
            if (authLoading) return;

            const userId = user?.id || user?._id || user?.teacherId;

            if (!userId) {
                console.error('TeacherProfile: No userId found in user object:', user);
                setError(`User ID not found. User data: ${JSON.stringify(user || 'null')}`);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/teachers/profile/${userId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch teacher profile');
                }

                const data = await response.json();

                // Format dates
                const formatDate = (dateString) => {
                    if (!dateString) return 'N/A';
                    return new Date(dateString).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                };

                const formattedData = {
                    ...data,
                    dateOfBirth: formatDate(data.dateOfBirth),
                    joinDate: formatDate(data.createdAt)
                };

                setTeacherData(formattedData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching teacher profile:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchTeacherProfile();
    }, [user, authLoading]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 bg-red-50 rounded-xl">
                <p className="text-red-600 font-bold">Error: {error}</p>
            </div>
        );
    }

    if (!teacherData) return null;

    const StatusBadge = ({ status }) => {
        const colors = {
            approved: 'bg-green-100 text-green-700 border-green-200',
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            rejected: 'bg-red-100 text-red-700 border-red-200'
        };

        const config = colors[status] || colors.pending;

        return (
            <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide border ${config}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    My Profile
                </h1>
                <p className="text-gray-500">Manage your personal and professional information</p>
            </div>

            {/* Main Profile Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0 w-full lg:w-auto flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
                            {teacherData.firstName?.[0]}{teacherData.lastName?.[0]}
                        </div>
                        <StatusBadge status={teacherData.status} />
                    </div>

                    {/* Basic Info */}
                    <div className="flex-grow text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {teacherData.firstName} {teacherData.lastName}
                        </h2>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-gray-600 mb-6">
                            <span className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faEnvelope} className="text-blue-500" />
                                {teacherData.email}
                            </span>
                            <span className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faPhone} className="text-green-500" />
                                {teacherData.whatsappNumber}
                            </span>
                            <span className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500" />
                                {teacherData.city}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Join Date</p>
                                <p className="font-semibold text-gray-800">{teacherData.joinDate}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Experience</p>
                                <p className="font-semibold text-gray-800">{teacherData.totalExperience} Years</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Gender</p>
                                <p className="font-semibold text-gray-800">{teacherData.gender}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Subjects</p>
                                <p className="font-semibold text-gray-800">{teacherData.subjectMajor}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-8">

                {/* Education */}
                <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                            <FontAwesomeIcon icon={faGraduationCap} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Education Details</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <FontAwesomeIcon icon={faUniversity} className="mt-1 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500 font-semibold uppercase">Degree</p>
                                <p className="font-bold text-gray-800">{teacherData.degreeTitle}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <FontAwesomeIcon icon={faBookOpen} className="mt-1 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500 font-semibold uppercase">Major</p>
                                <p className="font-bold text-gray-800">{teacherData.subjectMajor}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <FontAwesomeIcon icon={faSchool} className="mt-1 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500 font-semibold uppercase">University / Board</p>
                                <p className="font-bold text-gray-800">{teacherData.universityBoard}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gray-50">
                                <p className="text-sm text-gray-500 font-semibold uppercase">Passing Year</p>
                                <p className="font-bold text-gray-800">{teacherData.passingYear}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50">
                                <p className="text-sm text-gray-500 font-semibold uppercase">CGPA / Grade</p>
                                <p className="font-bold text-gray-800">{teacherData.gradeCGPA}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal & Other */}
                <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                            <FontAwesomeIcon icon={faIdCard} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Personal Info</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                            <span className="text-gray-600 font-medium">Father's Name</span>
                            <span className="font-bold text-gray-800">{teacherData.fatherName}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                            <span className="text-gray-600 font-medium">Date of Birth</span>
                            <span className="font-bold text-gray-800">{teacherData.dateOfBirth}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                            <span className="text-gray-600 font-medium">Marital Status</span>
                            <span className="font-bold text-gray-800">{teacherData.maritalStatus || 'N/A'}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TeacherProfile;
