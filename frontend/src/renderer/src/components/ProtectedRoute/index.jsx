import { Navigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUser()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute 