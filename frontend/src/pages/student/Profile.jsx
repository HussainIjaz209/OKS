import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faUserSlash,
  faExclamationCircle,
  faUserCheck,
  faUser,
  faMale,
  faFemale,
  faBirthdayCake,
  faPhone,
  faEnvelope,
  faGraduationCap,
  faSchool,
  faUsers,
  faHashtag,
  faCalendarCheck,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

const StudentProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      // Wait for auth to initialize
      if (authLoading) return;

      const userId = user?.studentId || user?.id || user?._id || user?.userId;
      const isInvalidId = !userId || userId === 'null' || userId === 'undefined';

      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      if (isInvalidId) {
        setError('User ID not found. Please try logging out and back in.');
        setLoading(false);
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/api/students/profile/${userId}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch student profile');
        }

        const data = await response.json();

        // Format date of birth
        const formattedData = {
          ...data,
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
            : 'N/A'
        };

        setStudentData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student profile:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md">
          <div className="text-center">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <FontAwesomeIcon
            icon={faUserSlash}
            className="text-gray-400 text-6xl mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Profile Found</h2>
          <p className="text-gray-600">Student profile data is not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Student Profile <FontAwesomeIcon icon={faUserGraduate} className="text-black" />
        </h1>
        <p className="text-gray-600 text-lg">Manage your personal and academic information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
        {/* Profile Header with Avatar */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start mb-8">
          <div className="relative mb-6 lg:mb-0 lg:mr-8">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-3">
              {studentData.profileImage ? (
                <img
                  src={studentData.profileImage}
                  alt={studentData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-purple-600');
                  }}
                />
              ) : (
                studentData.name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            {/* Online Status Indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
          </div>

          <div className="text-center lg:text-left flex-1">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              {studentData.name}
            </h2>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-4">
              <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm shadow-md">
                {studentData.class}
              </span>
              <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-4 py-2 rounded-full font-semibold text-sm shadow-md">
                Section {studentData.section}
              </span>
              <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-4 py-2 rounded-full font-semibold text-sm shadow-md">
                Roll No: {studentData.rollNumber}
              </span>
            </div>
            <div className="flex items-center justify-center lg:justify-start text-gray-600">
              <FontAwesomeIcon icon={faUserCheck} className="text-green-500 mr-2" />
              <span>Active Student • Verified Profile</span>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faUser} className="text-white text-lg" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Personal Information
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md">
                <label className="block text-gray-500 font-medium text-sm mb-1 flex items-center">
                  <FontAwesomeIcon icon={faMale} className="mr-2 text-blue-500" />
                  Father's Name
                </label>
                <p className="text-gray-800 font-semibold">{studentData.fatherName}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md">
                <label className="block text-gray-500 font-medium text-sm mb-1 flex items-center">
                  <FontAwesomeIcon icon={faFemale} className="mr-2 text-pink-500" />
                  Mother's Name
                </label>
                <p className="text-gray-800 font-semibold">{studentData.motherName}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md">
                <label className="block text-gray-500 font-medium text-sm mb-1 flex items-center">
                  <FontAwesomeIcon icon={faBirthdayCake} className="mr-2 text-yellow-500" />
                  Date of Birth
                </label>
                <p className="text-gray-800 font-semibold">{studentData.dateOfBirth}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md">
                <label className="block text-gray-500 font-medium text-sm mb-1 flex items-center">
                  <FontAwesomeIcon icon={faPhone} className="mr-2 text-green-500" />
                  Contact Number
                </label>
                <p className="text-gray-800 font-semibold">{studentData.contactNumber}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md">
                <label className="block text-gray-500 font-medium text-sm mb-1 flex items-center">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-red-500" />
                  Email Address
                </label>
                <p className="text-gray-800 font-semibold">{studentData.email}</p>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faGraduationCap} className="text-white text-lg" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Academic Information
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md">
                <label className="block text-gray-500 font-medium text-sm mb-1 flex items-center">
                  <FontAwesomeIcon icon={faSchool} className="mr-2 text-indigo-500" />
                  Current Class
                </label>
                <p className="text-gray-800 font-semibold">{studentData.class}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md">
                <label className="block text-gray-500 font-medium text-sm mb-1 flex items-center">
                  <FontAwesomeIcon icon={faUsers} className="mr-2 text-blue-500" />
                  Section
                </label>
                <p className="text-gray-800 font-semibold">{studentData.section}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md">
                <label className="block text-gray-500 font-medium text-sm mb-1 flex items-center">
                  <FontAwesomeIcon icon={faHashtag} className="mr-2 text-gray-500" />
                  Roll Number
                </label>
                <p className="text-gray-800 font-semibold">{studentData.rollNumber}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md">
                <label className="block text-gray-500 font-medium text-sm mb-1 flex items-center">
                  <FontAwesomeIcon icon={faCalendarCheck} className="mr-2 text-green-500" />
                  Attendance
                </label>
                <div className="flex items-center justify-between">
                  <p className="text-gray-800 font-semibold">{studentData.attendance}</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                      style={{ width: studentData.attendance }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                <FontAwesomeIcon icon={faHome} className="mr-2 text-orange-500" />
                Residential Address
              </h4>
              <p className="text-gray-600 leading-relaxed">{studentData.address}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default StudentProfile