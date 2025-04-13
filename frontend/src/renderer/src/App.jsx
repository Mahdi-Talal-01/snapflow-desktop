import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import EditImage from './pages/EditImage'
import Chat from './pages/Chat'
import Header from './components/Header'
import { useSelector } from 'react-redux'

const App = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit-image" element={<EditImage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
