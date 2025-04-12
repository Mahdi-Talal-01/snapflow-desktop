import { Outlet } from 'react-router-dom'
import Header from './components/Header'


const Layout = () => {
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
