import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../apiConfig'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from './Sidebar'
import Header from './Header'

import PendingApproval from './PendingApproval'
import { useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt } from '@fortawesome/free-solid-svg-icons'

const Layout = ({ children, role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()
  const [isRestrictedStudent, setIsRestrictedStudent] = useState(false)
  const [restrictionReason, setRestrictionReason] = useState('')

  useEffect(() => {
    const checkRestrictions = async () => {
      if (role === 'student' && (user?.studentId || user?.id)) {
        try {
          const studentId = user.studentId || user.id;
          const feeRes = await fetch(`${API_BASE_URL}/api/fees/invoices?studentId=${studentId}`)
          const invoices = await feeRes.json()

          if (Array.isArray(invoices)) {
            let pendingAmount = 0;
            let hasAdmissionFee = false;

            invoices.forEach(inv => {
              if (inv.status !== 'paid') {
                pendingAmount += (inv.remainingBalance !== undefined ? inv.remainingBalance : inv.amount);
                if (inv.type === 'Admission Fee' || inv.description?.toLowerCase().includes('admission')) {
                  hasAdmissionFee = true;
                }
              }
            });

            if (hasAdmissionFee) {
              setIsRestrictedStudent(true);
              setRestrictionReason('Your Admission Fee is pending. Please clear it to access all portal features.');
            } else if (pendingAmount > 5000) {
              setIsRestrictedStudent(true);
              setRestrictionReason('Your outstanding dues exceed $5,000. Please clear your balance to access all portal features.');
            } else {
              setIsRestrictedStudent(false);
            }
          }
        } catch (error) {
          console.error('Error checking student restrictions:', error)
        }
      }
    }

    checkRestrictions()
  }, [role, user])

  // Check if teacher is pending/rejected
  const isRestrictedTeacher = role === 'teacher' && (user?.status === 'pending' || user?.status === 'rejected');

  // Allowed pages for restricted students
  const isAllowedStudentPage = location.pathname === '/student' ||
    location.pathname === '/student/profile' ||
    location.pathname === '/student/fees';

  const showRestrictedView = (isRestrictedTeacher && location.pathname !== '/teacher/profile') ||
    (isRestrictedStudent && !isAllowedStudentPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header
        user={user}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex">
        <Sidebar
          role={role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isRestricted={role === 'student' ? isRestrictedStudent : isRestrictedTeacher}
        />

        <main className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
          }`}>
          {showRestrictedView ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg border border-red-100">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faReceipt} className="text-3xl text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Access Restricted</h2>
                <p className="text-gray-600 mb-8 text-lg">
                  {role === 'teacher' ? "Your account is awaiting approval from the administration." : restrictionReason}
                </p>
                {role === 'student' && (
                  <button
                    onClick={() => window.location.hash = '#/student/fees'}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform"
                  >
                    Go to Fees Section
                  </button>
                )}
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}

export default Layout