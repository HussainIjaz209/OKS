import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const { user } = useAuth()
  
  if (user) {
    return <Navigate to={`/${user.role}`} replace />
  }
  
  return <Navigate to="/" replace />
}

export default Login