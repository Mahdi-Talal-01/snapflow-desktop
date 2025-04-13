import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import './style.css'

const Layout = () => {
  console.log('Layout component rendered')
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout 