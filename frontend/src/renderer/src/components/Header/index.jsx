import React from 'react'
import './style.css'
import { Icon } from '@iconify/react'
import { useDispatch } from 'react-redux'
import { openUploadModel } from '../../redux/Slices/uploadModelSlice'
import { logout } from '../../redux/Slices/userSlice'
import { useNavigate, useLocation } from 'react-router-dom'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isChatPage = location.pathname === '/chat'

  const handleUploadClick = () => {
    dispatch(openUploadModel())
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth')
  }

  const handleHomeClick = () => {
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>SnapFlow</h1>
      </div>
      <div className="header-right">
        {!isChatPage && (
          <>
            <button className="chat-button" onClick={() => navigate('/chat')}>
              <Icon icon="mdi:chat" width="24" height="24" />
            </button>
            <div className="upload-btn" onClick={handleUploadClick}>
              <div className="text-wrapper">upload</div>
            </div>
          </>
        )}
        <div className="logout" onClick={handleLogout}>
          <Icon icon="material-symbols:logout" width="24" height="24" />
        </div>
      </div>
    </header>
  )
}

export default Header
