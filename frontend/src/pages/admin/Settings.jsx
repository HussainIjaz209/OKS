import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faLock,
    faFingerprint,
    faUser,
    faCheckCircle,
    faExclamationTriangle,
    faSave
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext'

const AdminSettings = () => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const { user } = useAuth()

    const [securityData, setSecurityData] = useState({
        username: user?.username || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handleSecurityUpdate = async (e) => {
        if (e) e.preventDefault();

        if (securityData.newPassword && securityData.newPassword !== securityData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' })
            return
        }

        if (!securityData.currentPassword) {
            setMessage({ type: 'error', text: 'Current password is required' })
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${user.id}/credentials`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: securityData.username,
                    currentPassword: securityData.currentPassword,
                    newPassword: securityData.newPassword || undefined
                })
            })

            const data = await response.json()
            if (response.ok) {
                setMessage({ type: 'success', text: 'Credentials updated successfully!' })
                setSecurityData({ ...securityData, currentPassword: '', newPassword: '', confirmPassword: '' })
            } else {
                setMessage({ type: 'error', text: data.message || 'Update failed' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network Error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Account Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Manage your administrative credentials and security
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md shadow-inner">
                            <FontAwesomeIcon icon={faFingerprint} className="text-3xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Security & Access</h2>
                            <p className="text-blue-100 opacity-80">Update your username and administrative password</p>
                        </div>
                    </div>

                    <form onSubmit={handleSecurityUpdate} className="p-8 space-y-8">
                        {message.text && (
                            <div className={`p-4 rounded-2xl flex items-center gap-4 animate-fade-in ${message.type === 'success'
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800'
                                }`}>
                                <FontAwesomeIcon icon={message.type === 'success' ? faCheckCircle : faExclamationTriangle} className="text-xl" />
                                <span className="font-semibold">{message.text}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Administrative Username</label>
                                <div className="relative group">
                                    <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all font-medium"
                                        value={securityData.username}
                                        onChange={(e) => setSecurityData({ ...securityData, username: e.target.value })}
                                        placeholder="Username"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Verification Required</label>
                                <div className="relative group">
                                    <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="password"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all font-medium"
                                        placeholder="Enter your current password to confirm changes"
                                        value={securityData.currentPassword}
                                        onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">New Password</label>
                                <div className="relative group">
                                    <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="password"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all font-medium"
                                        placeholder="Minimum 6 characters"
                                        value={securityData.newPassword}
                                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Confirm New Password</label>
                                <div className="relative group">
                                    <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="password"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all font-medium"
                                        placeholder="Repeat new password"
                                        value={securityData.confirmPassword}
                                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-2xl hover:scale-[1.01] transform transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Applying Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faSave} />
                                        <span>Save Administrative Settings</span>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 italic">
                                Leave new password fields empty to only update your admin username.
                            </p>
                        </div>
                    </form>
                </div>

                <div className="mt-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl p-8 border border-blue-100 dark:border-blue-900/30 flex items-start gap-6 backdrop-blur-sm">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 shadow-sm">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900 dark:text-blue-300 text-lg mb-2">Administrative Security Note</h4>
                        <p className="text-blue-700 dark:text-blue-400 leading-relaxed">
                            Changes made here will affect your administrative login credentials immediately.
                            Ensure you remember your new password as it is critical for system access.
                            For security reasons, we recommend updating your password every 90 days.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminSettings
