import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser,
    faLock,
    faSave,
    faFingerprint,
    faExclamationTriangle,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext'

const Settings = () => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const [formData, setFormData] = useState({
        username: user?.username || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setMessage({ type: '', text: '' }) // Clear message on change
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' })
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${user.id}/credentials`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword || undefined
                })
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: 'Settings updated successfully!' })
                setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' })
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update settings' })
            }
        } catch (error) {
            console.error('Settings update error:', error)
            setMessage({ type: 'error', text: 'Network error. Please try again later.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Account Settings
                </h1>
                <p className="text-gray-600 text-lg">
                    Manage your account security and credentials
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform transition-all">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
                            <FontAwesomeIcon icon={faFingerprint} className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Security & Login</h2>
                            <p className="text-blue-100 text-sm opacity-80">Update your credentials to keep your account safe</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {message.text && (
                            <div className={`p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                <FontAwesomeIcon icon={message.type === 'success' ? faCheckCircle : faExclamationTriangle} />
                                <span className="font-medium text-sm">{message.text}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                                <div className="relative group">
                                    <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="username"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                <div className="relative group">
                                    <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        placeholder="Required to make any changes"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                    <div className="relative group">
                                        <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="password"
                                            name="newPassword"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                            placeholder="Min 6 characters"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                    <div className="relative group">
                                        <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                            placeholder="Repeat new password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 italic mt-2">
                                * Leave new password fields empty to only update your username.
                            </p>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-2xl hover:scale-[1.02] transform transition-all active:scale-95 flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faSave} />
                                        <span>Save Credentials</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100 flex gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900 text-sm">Pro Tip</h4>
                        <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                            Use a strong password combining uppercase and lowercase letters, numbers, and symbols.
                            Never share your credentials with anyone.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
