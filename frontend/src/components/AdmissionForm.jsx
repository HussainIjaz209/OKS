import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserGraduate,
  faAddressCard,
  faCircle,
  faRocket,
  faBirthdayCake,
  faMale,
  faFemale,
  faGraduationCap,
  faEnvelope,
  faPhone,
  faHome,
  faCheckCircle,
  faPaperPlane,
  faArrowRight,
  faArrowLeft,
  faCalendarAlt,
  faPrayingHands,
  faTint,
  faBriefcase,
  faIdCard,
  faSchool,
  faUserTie,
  faGlobe,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { API_BASE_URL } from '../apiConfig'


const AdmissionForm = () => {
  // Form state includes all required fields
  const [formData, setFormData] = useState({
    // Student Profile
    firstName: '',
    lastName: '',
    studentName: '', // backend compatibility
    fatherName: '',
    admissionClass: '',
    admissionDate: new Date().toISOString().split('T')[0], // auto today
    dateOfBirth: '',
    religion: '',
    bloodGroup: '',
    gender: '',
    fatherOccupation: '',
    fatherAddress: '',
    fatherCNIC: '',
    // Guardian Profile
    guardianName: '', // default suggestion will be fatherName
    guardianContact: '',
    guardianEmail: '',
    guardianRelation: '',
    guardianCNIC: '',
    guardianEducation: '',
    guardianOccupation: '',
    guardianAddress: '',
    // Declaration
    declarationAccepted: false,
    // Account Setup (Step 4)
    username: '',
    password: '',
    studentId: null // store returned ID after step 3
  })

  const [currentStep, setCurrentStep] = useState(1)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value
    setFormData((prev) => ({ ...prev, [name]: fieldValue }))
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
    const { name, value } = e.target;
    if (value.length <= 15) {
      const formatted = formatCNIC(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
  }

  // Simple validation for each step
  const validateStep = (step) => {
    if (step === 1) {
      const { firstName, lastName, fatherName, admissionClass, dateOfBirth, fatherAddress, fatherCNIC, gender } = formData
      if (!firstName || !lastName || !fatherName || !admissionClass || !dateOfBirth || !fatherAddress || !fatherCNIC || !gender) {
        alert('Please fill all required fields in Student Profile (including Gender) before proceeding.')
        return false
      }
    } else if (step === 2) {
      const { guardianName, guardianContact, guardianRelation, guardianEmail, guardianCNIC } = formData
      if (!guardianName || !guardianContact || !guardianRelation || !guardianEmail || !guardianCNIC) {
        alert('Please fill all required fields in Guardian Profile (including Email and CNIC) before proceeding.')
        return false
      }
    }
    return true
  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.declarationAccepted) {
      alert('Please accept the declaration before submitting.')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          studentName: `${formData.firstName} ${formData.lastName}`.trim()
        }),
      });

      if (response.ok) {
        const student = await response.json();
        // Transition to Step 4 instead of resetting
        setFormData(prev => ({ ...prev, studentId: student._id }));
        setCurrentStep(4);
      } else {
        const data = await response.json();
        alert(`Submission failed: ${data.message}`);
      }
    } catch (error) {
      alert('Error connecting to server. Please try again later.');
      console.error(error);
    }
  }

  const handleAccountSetup = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      alert('Please provide both username and password.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/setup-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: formData.studentId,
          username: formData.username,
          password: formData.password
        }),
      });

      if (response.ok) {
        alert('Account created successfully! You can now login.');
        // Final Reset
        setFormData({
          firstName: '',
          lastName: '',
          studentName: '',
          fatherName: '',
          admissionClass: '',
          admissionDate: new Date().toISOString().split('T')[0],
          dateOfBirth: '',
          religion: '',
          bloodGroup: '',
          gender: '',
          fatherOccupation: '',
          fatherAddress: '',
          fatherCNIC: '',
          guardianName: '',
          guardianContact: '',
          guardianEmail: '',
          guardianRelation: '',
          guardianCNIC: '',
          guardianEducation: '',
          guardianOccupation: '',
          guardianAddress: '',
          declarationAccepted: false,
          username: '',
          password: '',
          studentId: null
        });
        setCurrentStep(1);
      } else {
        const data = await response.json();
        alert(`Account setup failed: ${data.message}`);
      }
    } catch (error) {
      alert('Error connecting to server. Please try again later.');
      console.error(error);
    }
  }

  const getStepColor = (step) =>
    currentStep >= step
      ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25'
      : 'bg-gray-500/50'

  const getStepIcon = (step) => {
    switch (step) {
      case 1:
        return faUserGraduate
      case 2:
        return faAddressCard
      case 3:
        return faCheckCircle
      case 4:
        return faIdCard
      default:
        return faCircle
    }
  }

  return (
    <section id="admission" className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
            <FontAwesomeIcon icon={faRocket} className="text-yellow-400 mr-2" />
            <span className="text-white font-semibold">Start Your Journey</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
            Online <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Admission</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Start your journey with us - simple, transparent admission process designed for modern education
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex flex-col items-center transition-all duration-500 ${currentStep === step ? 'scale-110' : ''}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${getStepColor(step)}`}>
                      <FontAwesomeIcon icon={getStepIcon(step)} className={`text-white text-lg ${currentStep === step ? 'scale-110' : ''}`} />
                    </div>
                    <span className={`text-sm font-semibold mt-2 transition-colors duration-300 ${currentStep >= step ? 'text-white' : 'text-gray-400'}`}>
                      {step === 1 && 'Student Profile'}
                      {step === 2 && 'Guardian Profile'}
                      {step === 3 && 'Declaration'}
                      {step === 4 && 'Account Setup'}
                    </span>
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 rounded-full transition-all duration-500 ${currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-500/50'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Student Profile */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">Student Profile</h3>
                  <p className="text-gray-300">Enter student details</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faUserGraduate} className="text-blue-400 mr-2" />
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  {/* Last Name */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faUserGraduate} className="text-blue-400 mr-2" />
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Father Name */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faMale} className="text-blue-400 mr-2" />
                      Father's Name *
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter father's name"
                      required
                    />
                  </div>
                  {/* Admission Class */}
                  <div className="md:col-span-2 group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-green-400 mr-2" />
                      Class Applying For *
                    </label>
                    <select
                      name="admissionClass"
                      value={formData.admissionClass}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      required
                    >
                      <option value="" className="text-gray-800">Select Class</option>
                      <option value="Play Group" className="text-gray-800">Play Group</option>
                      <option value="Foundation 1" className="text-gray-800">Foundation 1</option>
                      <option value="Foundation 2" className="text-gray-800">Foundation 2</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1} className="text-gray-800">Class {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  {/* Admission Date (auto) */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-400 mr-2" />
                      Admission Date
                    </label>
                    <input
                      type="date"
                      name="admissionDate"
                      value={formData.admissionDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      readOnly
                    />
                  </div>
                  {/* Date of Birth */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faBirthdayCake} className="text-purple-400 mr-2" />
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                  </div>
                  {/* Religion */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faGlobe} className="text-teal-400 mr-2" />
                      Religion
                    </label>
                    <input
                      type="text"
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter religion"
                    />
                  </div>
                  {/* Blood Group (optional) */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faTint} className="text-red-400 mr-2" />
                      Blood Group (optional)
                    </label>
                    <input
                      type="text"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-5 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="e.g., A+, O-"
                    />
                  </div>
                  {/* Gender */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faUser} className="text-pink-400 mr-2" />
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      required
                    >
                      <option value="" className="text-gray-800">Select Gender</option>
                      <option value="Male" className="text-gray-800">Male</option>
                      <option value="Female" className="text-gray-800">Female</option>
                      <option value="Other" className="text-gray-800">Other</option>
                    </select>
                  </div>
                  {/* Father Occupation */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faBriefcase} className="text-yellow-400 mr-2" />
                      Father Occupation
                    </label>
                    <input
                      type="text"
                      name="fatherOccupation"
                      value={formData.fatherOccupation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter occupation"
                    />
                  </div>
                  {/* Father Address */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faHome} className="text-orange-400 mr-2" />
                      Father Address
                    </label>
                    <textarea
                      name="fatherAddress"
                      value={formData.fatherAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none"
                      placeholder="Enter address"
                      rows={3}
                      required
                    />
                  </div>
                  {/* Father CNIC */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faIdCard} className="text-indigo-400 mr-2" />
                      Father CNIC *
                    </label>
                    <input
                      type="text"
                      name="fatherCNIC"
                      value={formData.fatherCNIC}
                      onChange={handleCNICChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="12345-1234567-8"
                      maxLength="15"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep(1)) setCurrentStep(2)
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 transform flex items-center"
                  >
                    Continue to Guardian
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Guardian Profile */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">Guardian Profile</h3>
                  <p className="text-gray-300">Enter guardian details (defaults can be copied from father)</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Guardian Name */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faUserTie} className="text-indigo-400 mr-2" />
                      Guardian Name *
                    </label>
                    <input
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleInputChange}
                      placeholder={formData.fatherName || ''}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                  </div>
                  {/* Contact Number */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faPhone} className="text-green-400 mr-2" />
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      name="guardianContact"
                      value={formData.guardianContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter contact number"
                      required
                    />
                  </div>
                  {/* Email (optional) */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faEnvelope} className="text-red-400 mr-2" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="guardianEmail"
                      value={formData.guardianEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  {/* Relation */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faPrayingHands} className="text-pink-400 mr-2" />
                      Relation *
                    </label>
                    <input
                      type="text"
                      name="guardianRelation"
                      value={formData.guardianRelation}
                      onChange={handleInputChange}
                      placeholder="e.g., Father, Mother, Uncle"
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                  </div>
                  {/* Guardian CNIC */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faIdCard} className="text-indigo-400 mr-2" />
                      Guardian CNIC *
                    </label>
                    <input
                      type="text"
                      name="guardianCNIC"
                      value={formData.guardianCNIC}
                      onChange={handleCNICChange}
                      placeholder={formData.fatherCNIC || '12345-1234567-8'}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      maxLength="15"
                      required
                    />
                  </div>
                  {/* Guardian Education */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faSchool} className="text-yellow-400 mr-2" />
                      Guardian Education
                    </label>
                    <input
                      type="text"
                      name="guardianEducation"
                      value={formData.guardianEducation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter education"
                    />
                  </div>
                  {/* Guardian Occupation */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faBriefcase} className="text-yellow-400 mr-2" />
                      Guardian Occupation
                    </label>
                    <input
                      type="text"
                      name="guardianOccupation"
                      value={formData.guardianOccupation}
                      onChange={handleInputChange}
                      placeholder={formData.fatherOccupation || ''}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  {/* Guardian Address */}
                  <div className="md:col-span-2 group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faHome} className="text-orange-400 mr-2" />
                      Guardian Address
                    </label>
                    <textarea
                      name="guardianAddress"
                      value={formData.guardianAddress}
                      onChange={handleInputChange}
                      placeholder={formData.fatherAddress || ''}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 transform flex items-center border border-white/20"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep(2)) setCurrentStep(3)
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 transform flex items-center"
                  >
                    Continue to Declaration
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Declaration */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">Declaration</h3>
                </div>
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    name="declarationAccepted"
                    checked={formData.declarationAccepted}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <label className="text-white">
                    I, <span className="font-semibold">{formData.fatherName || 'Father Name'}</span>, the Father/Guardian of <span className="font-semibold">{`${formData.firstName} ${formData.lastName}`.trim() || 'Student Name'}</span>, hereby solemnly declare that the particulars that I provide to the institution in the Admission Form are correct and true to the best of my knowledge and belief. In case of any incorrect or false information, I understand that I will be held responsible and liable for any consequences. I also agree to abide by the decision of the management and follow all the school/college rules and procedures. I will ensure that my son/daughter will also comply with the same and respect the authority of the institution.
                  </label>
                </div>
                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 transform flex items-center border border-white/20"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 transform flex items-center"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                    Submit Application
                  </button>
                </div>
              </div>
            )}
            {/* Step 4: Account Setup */}
            {currentStep === 4 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">Account Setup</h3>
                  <p className="text-gray-300">Choose your login credentials</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
                  <p className="text-blue-200 text-sm">
                    <FontAwesomeIcon icon={faRocket} className="mr-2" />
                    Application submitted! Now setup your account to access the student portal.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faUser} className="text-blue-400 mr-2" />
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                  {/* Password */}
                  <div className="group">
                    <label className="block text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faIdCard} className="text-purple-400 mr-2" />
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="Choose a password"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <button
                    type="button"
                    onClick={handleAccountSetup}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 transform flex items-center"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                    Complete Registration
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

export default AdmissionForm