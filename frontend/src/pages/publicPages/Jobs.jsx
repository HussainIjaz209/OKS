import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser,
    faEnvelope,
    faPhone,
    faBriefcase,
    faGraduationCap,
    faChalkboardTeacher,
    faCheckCircle,
    faPaperPlane,
    faArrowRight,
    faArrowLeft,
    faMale,
    faCity,
    faUniversity,
    faScroll,
    faCalendarAlt
} from '@fortawesome/free-solid-svg-icons'
import PublicLayout from '../../components/PublicLayout'
import LoginModal from '../../components/LoginModal'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../apiConfig'

const Jobs = () => {
    const [showLogin, setShowLogin] = useState(false)
    const navigate = useNavigate()

    const handleLoginSuccess = (role) => {
        setShowLogin(false)
        navigate(`/${role}`)
    }

    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        // Personal Information
        firstName: '',
        lastName: '',
        fatherName: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '', // optional
        city: '',

        // Contact Information
        whatsappNumber: '',
        email: '',

        // Education Details
        degreeTitle: '',
        subjectMajor: '',
        universityBoard: '',
        passingYear: '',
        gradeCGPA: '',

        // Experience
        totalExperience: '',

        // Declaration
        declarationAccepted: false,

        // Account Setup
        username: '',
        password: ''
    })

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        const fieldValue = type === 'checkbox' ? checked : value
        setFormData((prev) => ({ ...prev, [name]: fieldValue }))
    }

    const validateStep = (step) => {
        if (step === 1) {
            const { firstName, lastName, fatherName, dateOfBirth, gender, city, whatsappNumber, email } = formData
            if (!firstName || !lastName || !fatherName || !dateOfBirth || !gender || !city || !whatsappNumber || !email) {
                alert('Please fill all required fields in select section.')
                return false
            }
        } else if (step === 2) {
            const { degreeTitle, subjectMajor, universityBoard, passingYear, gradeCGPA, totalExperience } = formData
            if (!degreeTitle || !subjectMajor || !universityBoard || !passingYear || !gradeCGPA || !totalExperience) {
                alert('Please fill all required fields in Education & Experience section.')
                return false
            }
        }
        return true
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.declarationAccepted) {
            alert('Please accept the declaration before submitting.')
            return
        }
        if (!formData.username || !formData.password) {
            alert('Please provide a username and password.')
            return
        }

        const submitData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/jobs`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Application Submitted Successfully!');
                    navigate('/');
                } else {
                    alert(`Submission failed: ${data.message}`);
                }
            } catch (error) {
                console.error('Error submitting application:', error);
                alert('Error connecting to server. Please try again later.');
            }
        };

        submitData();
    }

    const getStepColor = (step) =>
        currentStep >= step
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25'
            : 'bg-gray-500/50'

    return (
        <>
            <PublicLayout onLogin={() => setShowLogin(true)}>
                <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">

                    {/* Background Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-4xl mx-auto relative z-10">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
                                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-yellow-400 mr-2" />
                                <span className="text-white font-semibold">Join Our Faculty</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black mb-4">
                                Apply for <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Teaching Positions</span>
                            </h1>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                We are looking for dedicated educators to join our team. Fill out the form below to start your journey with us.
                            </p>
                        </div>

                        {/* Form Container */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">

                            {/* Progress Steps */}
                            <div className="flex justify-center mb-12">
                                <div className="flex items-center space-x-4 md:space-x-8">
                                    {[1, 2, 3].map((step) => (
                                        <div key={step} className="flex items-center">
                                            <div className={`flex flex-col items-center transition-all duration-500 ${currentStep === step ? 'scale-110' : ''}`}>
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${getStepColor(step)}`}>
                                                    <span className="font-bold text-lg">{step}</span>
                                                </div>
                                                <span className={`text-xs font-semibold mt-2 hidden md:block transition-colors duration-300 ${currentStep >= step ? 'text-white' : 'text-gray-400'}`}>
                                                    {step === 1 && 'Personal Details'}
                                                    {step === 2 && 'Education/Exp'}
                                                    {step === 3 && 'Submit'}
                                                </span>
                                            </div>
                                            {step < 3 && (
                                                <div className={`w-12 md:w-24 h-1 rounded-full ml-4 transition-all duration-500 ${currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-500/50'}`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>

                                {/* Step 1: Personal & Contact Information */}
                                {currentStep === 1 && (
                                    <div className="space-y-8 animate-fade-in">

                                        {/* Personal Info Section */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-blue-300 mb-6 border-b border-white/10 pb-2">Personal Information</h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="group">
                                                    <label className="block text-sm font-semibold mb-2">First Name *</label>
                                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                                                </div>
                                                <div className="group">
                                                    <label className="block text-sm font-semibold mb-2">Last Name *</label>
                                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                                                </div>
                                                <div className="group">
                                                    <label className="block text-sm font-semibold mb-2">Father's Name *</label>
                                                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                                                </div>
                                                <div className="group">
                                                    <label className="block text-sm font-semibold mb-2">Date of Birth *</label>
                                                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                                                </div>
                                                <div className="group">
                                                    <label className="block text-sm font-semibold mb-2">Gender *</label>
                                                    <select name="gender" value={formData.gender} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [&>option]:text-black" required>
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="group">
                                                    <label className="block text-sm font-semibold mb-2">Marital Status (Optional)</label>
                                                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [&>option]:text-black">
                                                        <option value="">Select Status</option>
                                                        <option value="Single">Single</option>
                                                        <option value="Married">Married</option>
                                                    </select>
                                                </div>
                                                <div className="group">
                                                    <label className="block text-sm font-semibold mb-2">City *</label>
                                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Info Section */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-green-300 mb-6 border-b border-white/10 pb-2">Contact Information</h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="group">
                                                    <label className="block text-sm font-semibold mb-2">WhatsApp Number *</label>
                                                    <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" placeholder="+92..." required />
                                                </div>
                                                <div className="group">
                                                    <label className="block text-sm font-semibold mb-2">Email Address *</label>
                                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" required />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-6">
                                            <button type="button" onClick={() => validateStep(1) && setCurrentStep(2)}
                                                className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all">
                                                Next Step <FontAwesomeIcon icon={faArrowRight} />
                                            </button>
                                        </div>

                                    </div>
                                )}

                                {/* Step 2: Education & Experience */}
                                {currentStep === 2 && (
                                    <div className="space-y-8 animate-fade-in">

                                        {/* Education Section */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-yellow-300 mb-6 border-b border-white/10 pb-2">Education Details</h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="group">
                                                    <label className="block text-sm font-semibold mb-2">Degree Title *</label>
                                                    <input type="text" name="degreeTitle" value={formData.degreeTitle} onChange={handleInputChange}
                                                        placeholder="e.g. BS Computer Science"
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" required />
                                                </div>
                                                <div className="group">
                                                    <label className="block text-sm font-semibold mb-2">Subject / Major *</label>
                                                    <input type="text" name="subjectMajor" value={formData.subjectMajor} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" required />
                                                </div>
                                                <div className="group">
                                                    <label className="block text-sm font-semibold mb-2">University / Board *</label>
                                                    <input type="text" name="universityBoard" value={formData.universityBoard} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" required />
                                                </div>
                                                <div className="group">
                                                    <label className="block text-sm font-semibold mb-2">Passing Year *</label>
                                                    <input type="number" name="passingYear" value={formData.passingYear} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" required />
                                                </div>
                                                <div className="group">
                                                    <label className="block text-sm font-semibold mb-2">Grade / CGPA *</label>
                                                    <input type="text" name="gradeCGPA" value={formData.gradeCGPA} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" required />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Experience Section */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-red-300 mb-6 border-b border-white/10 pb-2">Experience</h3>
                                            <div className="group">
                                                <label className="block text-sm font-semibold mb-2">Total Teaching Experience (Years) *</label>
                                                <input type="number" name="totalExperience" value={formData.totalExperience} onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all" min="0" required />
                                            </div>
                                        </div>

                                        <div className="flex justify-between pt-6">
                                            <button type="button" onClick={() => setCurrentStep(1)}
                                                className="bg-white/10 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-all">
                                                <FontAwesomeIcon icon={faArrowLeft} /> Previous
                                            </button>
                                            <button type="button" onClick={() => validateStep(2) && setCurrentStep(3)}
                                                className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all">
                                                Next Step <FontAwesomeIcon icon={faArrowRight} />
                                            </button>
                                        </div>

                                    </div>
                                )}

                                {/* Step 3: Declaration & Submit */}
                                {currentStep === 3 && (
                                    <div className="space-y-8 animate-fade-in text-center">

                                        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 max-w-2xl mx-auto">
                                            <FontAwesomeIcon icon={faScroll} className="text-6xl text-yellow-400 mb-6" />
                                            <h3 className="text-3xl font-bold mb-6">Declaration</h3>

                                            <div className="text-left bg-white/5 p-6 rounded-xl border border-white/10 mb-8">
                                                <label className="flex items-start cursor-pointer gap-4">
                                                    <input type="checkbox" name="declarationAccepted" checked={formData.declarationAccepted}
                                                        onChange={handleInputChange} className="mt-1 w-6 h-6 text-blue-600 rounded focus:ring-blue-500" />
                                                    <span className="text-gray-200 leading-relaxed font-medium">
                                                        “I confirm that all the information provided is correct. Any false information may lead to rejection.”
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="text-left mb-8">
                                                <h3 className="text-2xl font-bold text-blue-300 mb-6 border-b border-white/10 pb-2">Account Setup</h3>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="group">
                                                        <label className="block text-sm font-semibold mb-2">Username *</label>
                                                        <input type="text" name="username" value={formData.username} onChange={handleInputChange}
                                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left" placeholder="Choose a username" required />
                                                    </div>
                                                    <div className="group">
                                                        <label className="block text-sm font-semibold mb-2">Password *</label>
                                                        <input type="password" name="password" value={formData.password} onChange={handleInputChange}
                                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left" placeholder="Choose a password" required />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <button type="button" onClick={() => setCurrentStep(2)}
                                                    className="flex-1 bg-white/10 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                                                    <FontAwesomeIcon icon={faArrowLeft} /> Review
                                                </button>
                                                <button type="submit" disabled={!formData.declarationAccepted}
                                                    className={`flex-1 px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                            ${formData.declarationAccepted ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:scale-105' : 'bg-gray-600 cursor-not-allowed opacity-50'}`}>
                                                    <FontAwesomeIcon icon={faPaperPlane} /> Submit Application
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </form>
                        </div>
                    </div>
                </div>
            </PublicLayout>

            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </>
    )
}

export default Jobs
