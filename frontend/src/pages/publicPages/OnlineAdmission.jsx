import React, { useState } from 'react'
import AdmissionForm from '../../components/AdmissionForm'
import PublicLayout from '../../components/PublicLayout'
import LoginModal from '../../components/LoginModal' // Import LoginModal
import { useNavigate } from 'react-router-dom'

export default function OnlineAdmission() {
  const [showLogin, setShowLogin] = useState(false)
  const navigate = useNavigate()

  const handleLoginSuccess = (role) => {
    setShowLogin(false)
    navigate(`/${role}`)
  }

  return (
    <>
      <PublicLayout onLogin={() => setShowLogin(true)}>
        <AdmissionForm />
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