import React, { useState } from 'react'
import useForm from '../../hooks/useForm'
import './style.css'
import { Icon } from '@iconify/react'
import axios from 'axios'
import { request } from '../../../../core/config/baseAPI'
// import { useUser } from '../../hooks/useUser'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/Slices/userSlice'

const Auth = () => {
  const dispatch = useDispatch()
  //   const { login } = useUser()
  const navigate = useNavigate()
  const [form, handleChange] = useForm({
    name: '',
    email: '',
    password: ''
  })
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const getIpInfo = async () => {
    try {
      const response = await axios.get('https://ipapi.co/json/')
      return {
        ip: response.data.ip,
        latitude: response.data.latitude,
        longitude: response.data.longitude
      }
    } catch (error) {
      console.error('Error fetching IP info:', error)
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const ipInfo = await getIpInfo()
      if (!ipInfo) {
        throw new Error('Could not fetch location information')
      }

      const requestData = {
        email: form.email,
        password: form.password,
        ...(isLogin ? {} : { name: form.name }),
        ip_address: ipInfo.ip,
        latitude: ipInfo.latitude,
        longitude: ipInfo.longitude
      }

      const endpoint = isLogin ? '/login' : '/register'
      const response = await request({
        method: 'POST',
        route: endpoint,
        body: requestData
      })

      if (response.success) {
        console.log('Authentication successful:', response.data)
        // Store the token
        localStorage.setItem('access_token', response.data.token)
        dispatch(setUser(response.data))

        navigate('/')
      } else {
        console.error('Authentication failed:', response)
        throw new Error(response.message || 'Authentication failed')
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError(error.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setError('')
    // Reset form when switching modes
    handleChange({ target: { name: 'name', value: '' } })
    handleChange({ target: { name: 'email', value: '' } })
    handleChange({ target: { name: 'password', value: '' } })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="auth-header">
          <Icon icon="mdi:account-circle" width="48" height="48" className="auth-icon" />
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="auth-subtitle">
            {isLogin ? 'Sign in to continue to SnapFlow' : 'Register to start using SnapFlow'}
          </p>
        </div>
        {error && (
          <div className="error-message">
            <Icon icon="mdi:alert-circle" width="20" height="20" />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <Icon icon="mdi:account" className="input-icon" />
              <input
                type="text"
                placeholder="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="input-group">
            <Icon icon="mdi:email" className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <Icon icon="mdi:lock" className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
              <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} width="20" height="20" />
            </button>
          </div>
          <button
            type="submit"
            className={`auth-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <Icon icon="mdi:loading" className="spin" width="24" height="24" />
            ) : (
              <>
                <Icon icon={isLogin ? 'mdi:login' : 'mdi:account-plus'} width="24" height="24" />
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>
        <div className="toggle-auth">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={toggleAuthMode}>{isLogin ? 'Register' : 'Sign In'}</button>
        </div>
      </div>
    </div>
  )
}

export default Auth
