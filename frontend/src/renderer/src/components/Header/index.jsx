import React from 'react'
import './style.css'
import { Icon } from '@iconify/react'
import { useDispatch } from 'react-redux'
import { openUploadModel } from '../../redux/Slices/uploadModelSlice'
import { logout } from '../../redux/Slices/userSlice'
import { useNavigate } from 'react-router-dom'
const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleUploadClick = () => {
    dispatch(openUploadModel())
  }
  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth')
  }
  return (
    <div className="header">
      <div className="logo">
        <p>SnapFlow</p>
      </div>
      <div className="flex-center gap-2">
        <div className="upload-btn">
          <div className="text-wrapper" onClick={handleUploadClick}>
            upload
          </div>
        </div>

        <div className="logout" onClick={handleLogout}>
          <Icon icon="material-symbols:logout" width="24" height="24" />
        </div>
      </div>
    </div>
  )
}

export default Header
