import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Layout = () => {
  const user = useSelector((state) => state.user.user)
  const navigate = useNavigate()
  if (!user) {
    return navigate('/auth')
  }
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
