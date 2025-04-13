import { useSelector, useDispatch } from 'react-redux'
import { setUser, clearUser } from '../redux/Slices/userSlice'

export const useUser = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

  console.log('useUser hook - Current state:', { user, isAuthenticated })

  const login = (userData) => {
    console.log('useUser - Logging in user:', userData)
    dispatch(setUser(userData))
  }

  const logout = () => {
    console.log('useUser - Logging out user')
    dispatch(clearUser())
    localStorage.removeItem('access_token')
  }

  return {
    user,
    isAuthenticated,
    login,
    logout
  }
} 