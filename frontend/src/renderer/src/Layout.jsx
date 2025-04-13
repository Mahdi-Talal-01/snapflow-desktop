import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

const Layout = () => {
  const user = useSelector((state) => state.user.user)
  const navigate = useNavigate()
 useEffect(()=>{
  if(!user){
    navigate('/auth')
  }
 },[user,navigate])

  return (
    <>
      <Header />
      <main className="main-container">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
